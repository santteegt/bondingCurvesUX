import Enzyme, { shallow,mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import React from 'react';
import ReactDOM from 'react-dom';
import Timeline from '../../../BondingCurve/components/charts/Timeline/index';
import { bondingCurveContract, mockWeb3, mockEvents, mockEvent } from "../../mockContract";

Enzyme.configure({ adapter: new Adapter() })

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Timeline height={200} bondingCurveContract={bondingCurveContract} web3={mockWeb3} />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('renders and should process event', () => {
  const wrapper = shallow(
    <Timeline height={200} bondingCurveContract={bondingCurveContract} web3={mockWeb3} />
  );

  wrapper.instance().handleEvent(mockEvent, .9);

  expect(mockWeb3.eth.getBlock.mock.calls.length).toBe(1)
  expect(mockWeb3.eth.getBlock).toBeCalledWith(mockEvent.blockNumber);
});

it('should filter data', () => {
  const wrapper = mount(
    <Timeline height={200} bondingCurveContract={bondingCurveContract} web3={mockWeb3} />
  );

  wrapper.instance().setFilter = jest.fn()

  expect(wrapper.find("ul li").first().hasClass('active')).toBe(false);

  wrapper.find("ul li").first().simulate('click')

  expect(wrapper.find("ul li").first().hasClass('active')).toBe(true);

  expect(wrapper.state("activeFilter")).toBe("1D");
  expect(wrapper.state("minDomain")).not.toBe(0)

});

// it('should match snapshot', () => {
//   const wrapper = shallow(
//     <Timeline height={200} bondingCurveContract={bondingCurveContract} web3={mockWeb3} />
//   );
//   expect(wrapper).toMatchSnapshot()
// });

