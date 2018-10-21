import Enzyme, { mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import React from 'react';
import BondingCurve from '../BondingCurve/BondingCurve';
import getWeb3mock from "../utils/getWeb3";
import { bondingCurveContract, mockWeb3 } from "./mockContract";
import ReactDOM from "react-dom";
import ErrorBoundary from "react-error-boundary";
import ErrorComponent from "../BondingCurve/components/Error";
import MockTimeline from '../BondingCurve/components/charts/Timeline';
import Timeline from "../BondingCurve/components/charts/Timeline";

jest.mock('../utils/getWeb3', () => ({
    getWeb3: jest.fn()
}));

Enzyme.configure({ adapter: new Adapter() })


const contractAddress = "0x96eaf28b6e59defc8f736faa1681d41382d3aa32";
const contractArtifact = require("./BondingCurve.json");

beforeEach(() => {
    getWeb3mock.getWeb3 = jest.fn().mockReturnValue(mockWeb3)
})

afterEach(() => {
    mockWeb3.eth.getBlock.mockClear()
    bondingCurveContract.methods.scale.mockClear()
    bondingCurveContract.methods.tokenBalance.mockClear()
    bondingCurveContract.methods.dropsBalance.mockClear()
    bondingCurveContract.methods.dropsSupply.mockClear()
})

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<BondingCurve height={200} contractAddress={contractAddress} contractArtifact={contractArtifact} />, div);
    ReactDOM.unmountComponentAtNode(div);
});

it('should show error message invalid contract address', async () => {

    mockWeb3.utils.isAddress = (address) => address === contractAddress;

    const wrapper = mount(
        <BondingCurve height={200} contractAddress={"OX"} contractArtifact={contractArtifact} />,
    );

    await wrapper.instance().componentDidMount();

    expect(wrapper.state("loading")).toBe(false)
    expect(wrapper.state("error")).toBe("Invalid address")

});

it('should show error message if contract not deployed', async () => {

    mockWeb3.utils.isAddress = (address) => address === contractAddress;
    mockWeb3.eth.getCode = jest.fn().mockReturnValue("0x");

    const wrapper = mount(
        <BondingCurve height={200} contractAddress={contractAddress} contractArtifact={contractArtifact} />,
    );

    await wrapper.instance().componentDidMount();

    expect(wrapper.state("loading")).toBe(false)
    expect(wrapper.state("error")).toBe("Invalid contract")

});

it('should set State if contract exists', async () => {

    mockWeb3.utils.isAddress = (address) => address === contractAddress;
    mockWeb3.eth.getCode = jest.fn().mockReturnValue("0x0998989488948");



    const wrapper = mount(
        <BondingCurve height={200} defaultTab={"timeline"} contractAddress={contractAddress} contractArtifact={contractArtifact} />,
    );

    await wrapper.instance().componentDidMount();

    expect(wrapper.state("loading")).toBe(false)
    expect(wrapper.state("web3")).toBe(mockWeb3)
    expect(wrapper.state("contract")).toBe(bondingCurveContract)

});

it('if contractArtifact changes, should call getcontract again', async () => {

    mockWeb3.utils.isAddress = (address) => address === contractAddress;

    const wrapper = mount(
        <BondingCurve height={200} contractAddress={"0X"} contractArtifact={contractArtifact} />,
    );

    await wrapper.instance().componentDidMount();

    expect(getWeb3mock.getWeb3.mock.calls.length).toBe(2)

    wrapper.setProps({ contractAddress: "newOne" })

    expect(getWeb3mock.getWeb3.mock.calls.length).toBe(3)


});

