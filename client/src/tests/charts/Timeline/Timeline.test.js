import Enzyme, { mount, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import React from 'react';
import ReactDOM from 'react-dom';
import Timeline from '../../../BondingCurve/components/charts/Timeline/index';
import Footer from "../../../BondingCurve/components/Footer";
import { bondingCurveContract, mockEvent, mockWeb3 } from "../../mockContract";

Enzyme.configure({ adapter: new Adapter() })

const contractAddress = "0x96eaf28b6e59defc8f736faa1681d41382d3aa32";

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Timeline height={200} bondingCurveContract={bondingCurveContract} web3={mockWeb3} contractAddress={contractAddress} />, div);
  ReactDOM.unmountComponentAtNode(div);
});


// it('should match snapshot', () => {
//   const wrapper = shallow(
//     <Timeline height={200} bondingCurveContract={bondingCurveContract} web3={mockWeb3} contractAddress={contractAddress} />
//   );
//   expect(wrapper).toMatchSnapshot()
// });


it('renders and should process event', () => {
  const wrapper = shallow(
    <Timeline height={200} bondingCurveContract={bondingCurveContract} web3={mockWeb3} contractAddress={contractAddress} />
  );

  wrapper.instance().handleEvent(mockEvent, .9);

  expect(mockWeb3.eth.getBlock.mock.calls.length).toBe(1)
  expect(mockWeb3.eth.getBlock).toBeCalledWith(mockEvent.blockNumber);
});

it('should filter data', () => {
  const wrapper = mount(
    <Timeline height={200} bondingCurveContract={bondingCurveContract} web3={mockWeb3} contractAddress={contractAddress} />
  );

  wrapper.instance().setFilter = jest.fn()

  expect(wrapper.find("ul li").first().hasClass('active')).toBe(false);

  wrapper.find("ul li").first().simulate('click')

  expect(wrapper.find("ul li").first().hasClass('active')).toBe(true);

  expect(wrapper.state("activeFilter")).toBe("1D");
  expect(wrapper.state("minDomain")).not.toBe(0)

});

it('should handle contract address change', () => {
  const wrapper = shallow(
    <Timeline height={200} bondingCurveContract={bondingCurveContract} web3={mockWeb3} contractAddress={contractAddress} />
  );

  wrapper.instance().setState({ data: [{ x: 0, y: 1 }] })

  wrapper.setProps({ contractAddress: "0x" })

  expect(wrapper.state("data")).toEqual([])
});

it('should handle setDetail', () => {
  const wrapper = shallow(
    <Timeline height={200} bondingCurveContract={bondingCurveContract} web3={mockWeb3} contractAddress={contractAddress} />
  );

  wrapper.instance().setDetail({ x: 0, y: 1 })

  expect(wrapper.find(Footer).prop("detail").title).toEqual(`1.0000`)
  expect(wrapper.find(Footer).prop("detail").sub.indexOf("Jan 1, 1970")).toBe(0)

});

it('should rethrow error from state', () => {
  const wrapper = shallow(
      <Timeline height={200} bondingCurveContract={bondingCurveContract} web3={mockWeb3} contractAddress={contractAddress} />
  );

  try {
      wrapper.setState({ error: "error" })
  } catch(err){
      expect(err).toEqual("error")
  }

});


