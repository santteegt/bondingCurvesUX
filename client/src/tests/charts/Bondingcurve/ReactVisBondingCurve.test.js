import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import React from 'react';
import ReactDOM from 'react-dom';
import { MarkSeries, VerticalGridLines, XAxis } from 'react-vis';
import ReactVisBondingCurve from '../../../BondingCurve/components/charts/BondingCurve/ReactVisBondingCurve';

Enzyme.configure({ adapter: new Adapter() })

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<ReactVisBondingCurve height={200} data={[]} />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('should match snapshot', () => {
  const wrapper = shallow(
    <ReactVisBondingCurve height={200} data={[]} />
  );
  expect(wrapper).toMatchSnapshot()
});

it('should show hover elements is state has hoverValues', () => {
  const wrapper = shallow(
    <ReactVisBondingCurve height={200} data={[]} />
  );
  wrapper.setState({ hoverValues: [{ x: 0, y: 0 }] });

  expect(
    wrapper.containsMatchingElement(
      <VerticalGridLines />
    )
  ).toBe(true);

  expect(
    wrapper.containsMatchingElement(
      <XAxis />
    )
  ).toBe(true);

  expect(
    wrapper.containsMatchingElement(
      <MarkSeries />
    )
  ).toBe(true);
});

it('should handle _onMouseLeave', () => {
  const onShowDetail = jest.fn();
  const wrapper = shallow(
    <ReactVisBondingCurve height={200} data={[]} onShowDetail={onShowDetail} />
  );

  wrapper.instance()._onMouseLeave();

  expect(onShowDetail.mock.calls.length).toBe(1);
  expect(onShowDetail).toBeCalledWith();

  expect(wrapper.state('hoverValues')).toBe(null)

});


it('should handle _onNearestX', () => {
  const onShowDetail = jest.fn();
  const wrapper = shallow(
    <ReactVisBondingCurve height={200} data={[]} onShowDetail={onShowDetail} />
  );
  const nearest = { x: "x", y: "y" };

  wrapper.instance()._onNearestX(nearest);

  expect(onShowDetail.mock.calls.length).toBe(1);
  expect(onShowDetail).toBeCalledWith(nearest);

  expect(wrapper.state('hoverValues')[0]).toBe(nearest)

});

it('should handle getSupply', () => {
  const onShowDetail = jest.fn();
  const wrapper = shallow(
    <ReactVisBondingCurve height={200} data={[]} onShowDetail={onShowDetail} />
  );
  const nearest = { supply: 2, sell: 1,value:1 };

  expect(wrapper.instance().getSupply(nearest)).toBe(2)

});

it('should handle getSell', () => {
  const onShowDetail = jest.fn();
  const wrapper = shallow(
    <ReactVisBondingCurve height={200} data={[]} onShowDetail={onShowDetail} />
  );
  const nearest = { supply: 2, sell: 1,value:1 };

  expect(wrapper.instance().getSell(nearest)).toBe(1)

});

it('should handle getValue', () => {
  const onShowDetail = jest.fn();
  const wrapper = shallow(
    <ReactVisBondingCurve height={200} data={[]} onShowDetail={onShowDetail} />
  );
  const nearest = { supply: 2, sell: 1,value:1 };

  expect(wrapper.instance().getValue(nearest)).toBe(1)

});

it('should handle hasValue', () => {
  const onShowDetail = jest.fn();
  const wrapper = shallow(
    <ReactVisBondingCurve height={200} data={[]} onShowDetail={onShowDetail} />
  );
  const nearest = { supply: 2,value:1 };

  expect(wrapper.instance().hasValue(nearest)).toBe(false)

});

it('should handle tickFormat', () => {
  const onShowDetail = jest.fn();
  const wrapper = shallow(
    <ReactVisBondingCurve height={200} data={[]} onShowDetail={onShowDetail} />
  );

  expect(wrapper.instance().tickFormat(5000)).toBe('5 k')

});