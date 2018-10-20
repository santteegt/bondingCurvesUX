import React from 'react';
import ReactDOM from 'react-dom';
import ReactVisTimeline from '../../../BondingCurve/components/charts/Timeline/ReactVisTimeline';
import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { Crosshair, XAxis, MarkSeries } from 'react-vis';

Enzyme.configure({ adapter: new Adapter() })

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<ReactVisTimeline height={200} data={[]} />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('should match snapshot', () => {
  const wrapper = shallow(
    <ReactVisTimeline height={200} data={[]} />
  );
  expect(wrapper).toMatchSnapshot()
});

it('should show hover elements is state has hoverValues', () => {
  const wrapper = shallow(
    <ReactVisTimeline height={200} data={[]} />
  );
  wrapper.setState({ hoverValues: [{ x: 0, y: 0 }] });

  expect(
    wrapper.containsMatchingElement(
      <Crosshair />
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
    <ReactVisTimeline height={200} data={[]} onShowDetail={onShowDetail} />
  );

  wrapper.instance()._onMouseLeave();

  expect(onShowDetail.mock.calls.length).toBe(1);
  expect(onShowDetail).toBeCalledWith();

  expect(wrapper.state('hoverValues')).toBe(null)

});


it('should handle _onNearestX', () => {
  const onShowDetail = jest.fn();
  const wrapper = shallow(
    <ReactVisTimeline height={200} data={[]} onShowDetail={onShowDetail} />
  );
  const nearest = { x: "x", y: "y" };

  wrapper.instance()._onNearestX(nearest);

  expect(onShowDetail.mock.calls.length).toBe(1);
  expect(onShowDetail).toBeCalledWith(nearest);

  expect(wrapper.state('hoverValues')[0]).toBe(nearest)

});