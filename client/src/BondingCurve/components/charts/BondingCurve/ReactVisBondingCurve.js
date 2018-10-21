import { timeFormatDefaultLocale } from 'd3-time-format';
import english from 'd3-time-format/locale/en-US.json';
import PropTypes from "prop-types";
import React from 'react';
import { FlexibleWidthXYPlot, LineSeries, MarkSeries, XAxis, Crosshair, AreaSeries, YAxis, GradientDefs } from 'react-vis';
import "react-vis/dist/style.css";
import styles from "./bondingcurve.module.scss";
import numeral from "numeral";

// To prevent overflowing of large month names
timeFormatDefaultLocale({
    ...english,
    months: english.shortMonths
});

export default class ReactVisBondingCurve extends React.Component {
    state = {
        hoverValues: null
    }

    static propTypes = {
        onShowDetail: PropTypes.func,
        height: PropTypes.number.isRequired,
        data: PropTypes.array.isRequired,
    }

    _onMouseLeave = () => {
        const { onShowDetail } = this.props;

        this.setState({ hoverValues: null });

        if (onShowDetail) {
            onShowDetail()
        }
    };

    _onNearestX = (value) => {
        const { onShowDetail } = this.props;

        this.setState({ hoverValues: [value] });

        if (onShowDetail) {
            onShowDetail(value)
        }
    };

    getSupply = (d) => d.supply;
    getSell = (d) => d.sell;
    getValue = (d) => d.value;

    hasValue = (d) => !!d.sell;
    tickFormat = (d) => numeral(d).format('0 a');

    render() {
        const { hoverValues } = this.state;
        const { height, data } = this.props;

        return (
            <div className={styles.ocean_chart}>
                <FlexibleWidthXYPlot
                    margin={{ left: 0, right: 0, top: 10, bottom: 40 }}
                    animation
                    onMouseLeave={this._onMouseLeave}
                    getX={this.getSupply}
                    getY={this.getValue}
                    height={height}
                >
                    <GradientDefs>
                        <linearGradient id="oceanGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#ff4092" stopOpacity={0.8} />
                            <stop offset="70%" stopColor="white" stopOpacity={0} />
                        </linearGradient>
                    </GradientDefs>

                    <AreaSeries
                        color={'url(#oceanGradient)'}
                        getY={this.getSell}
                        getNull={this.hasValue}
                        data={data}
                    />
                    <LineSeries
                        strokeWidth={3}
                        className={styles.ocean_line}
                        style={{ strokeLinejoin: "round" }}
                        onNearestX={this._onNearestX}
                        data={data}
                    />

                    <YAxis
                        tickTotal={1}
                    />

                    {
                        hoverValues && (
                            <XAxis
                                tickTotal={3}
                                tickFormat={this.tickFormat}
                            />
                        )
                    }

                    {
                        hoverValues && (
                            <MarkSeries
                                className={styles.ocean_crosshair_dot}
                                size={4}
                                data={hoverValues}
                            />
                        )
                    }

                    {
                        hoverValues && (
                            <Crosshair
                                values={hoverValues}
                                className={styles.ocean_crosshair}
                            />
                        )
                    }

                </FlexibleWidthXYPlot>
            </div>
        );
    }
}