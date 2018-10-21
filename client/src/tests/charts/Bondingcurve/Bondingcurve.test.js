import Enzyme, { shallow, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import React from 'react';
import ReactDOM from 'react-dom';
import BondingCurve from '../../../BondingCurve/components/charts/BondingCurve/index';
import { bondingCurveContract, mockWeb3, mockEvents, mockEvent } from "../../mockContract";
import Footer from "../../../BondingCurve/components/Footer";
import moment from "moment";
import { wrap } from "module";

Enzyme.configure({ adapter: new Adapter() })

const contractAddress = "0x96eaf28b6e59defc8f736faa1681d41382d3aa32";


afterEach(() => {
    mockWeb3.eth.getBlock.mockClear()
    bondingCurveContract.methods.scale.mockClear()
    bondingCurveContract.methods.tokenBalance.mockClear()
    bondingCurveContract.methods.dropsBalance.mockClear()
    bondingCurveContract.methods.dropsSupply.mockClear()
})

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<BondingCurve height={200} bondingCurveContract={bondingCurveContract} web3={mockWeb3} contractAddress={contractAddress} />, div);
    ReactDOM.unmountComponentAtNode(div);
});

// it('should match snapshot', () => {
//     const wrapper = shallow(
//         <BondingCurve height={200} bondingCurveContract={bondingCurveContract} web3={mockWeb3} contractAddress={contractAddress} />
//     );
//     expect(wrapper).toMatchSnapshot()
// });

it('should handle setDetail', () => {
    const wrapper = shallow(
        <BondingCurve height={200} bondingCurveContract={bondingCurveContract} web3={mockWeb3} contractAddress={contractAddress} />
    );

    wrapper.instance().setDetail({ value: 5, supply: 10 })

    expect(wrapper.find(Footer).prop("detail")).toEqual({
        title: `5`,
        sub: "Supply: 10"
    })
});

it('should not call web3 for balances if no user', () => {
    const div = document.createElement('div');
    ReactDOM.render(<BondingCurve height={200} bondingCurveContract={bondingCurveContract} web3={mockWeb3} contractAddress={contractAddress} />, div);
    ReactDOM.unmountComponentAtNode(div);

    expect(bondingCurveContract.methods.dropsSupply.mock.calls.length).toBe(0);
    expect(bondingCurveContract.methods.dropsBalance.mock.calls.length).toBe(0);
    expect(bondingCurveContract.methods.tokenBalance.mock.calls.length).toBe(0);

});

it('should rethrow error from state', () => {
    const wrapper = shallow(
        <BondingCurve height={200} bondingCurveContract={bondingCurveContract} web3={mockWeb3} contractAddress={contractAddress} />
    );

    try {
        wrapper.setState({ error: "error" })
    } catch(err){
        expect(err).toEqual("error")
    }

});

