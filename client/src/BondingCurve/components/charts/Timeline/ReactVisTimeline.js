import { timeFormatDefaultLocale } from 'd3-time-format';
import english from 'd3-time-format/locale/en-US.json';
import moment from "moment";
import React from 'react';
import { Crosshair, FlexibleWidthXYPlot, LineSeries, MarkSeries, XAxis, GradientDefs, AreaSeries } from 'react-vis';
import "react-vis/dist/style.css";
import styles from "./timeline.module.scss";
import PropTypes from "prop-types";

// To prevent overflowing of large month names
timeFormatDefaultLocale({
    ...english,
    months: english.shortMonths
});

export default class ReactVisTimeline extends React.Component {
    state = {
        hoverValues: null
    }

    static propTypes = {
        onShowDetail: PropTypes.func,
        minDomain: PropTypes.number,
        height: PropTypes.number.isRequired,
        data: PropTypes.array.isRequired
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


    render() {
        const { hoverValues } = this.state;
        const { minDomain, height, data } = this.props;

        const domain = minDomain ? [minDomain, moment().endOf('day').valueOf()] : null;

        return (
            <div className={styles.ocean_chart}>
                <FlexibleWidthXYPlot
                    margin={{ left: 0, right: 0, top: 10, bottom: 40 }}
                    xType="time"
                    animation
                    onMouseLeave={this._onMouseLeave}
                    height={height}
                    xDomain={domain}>

                    <LineSeries
                        strokeWidth={3}
                        className={styles.ocean_line}
                        style={{ strokeLinejoin: "round" }}
                        onNearestX={this._onNearestX}
                        data={data}
                    />

                    <GradientDefs>
                        <linearGradient id="oceanGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#ff4092" stopOpacity={0.8} />
                            <stop offset="90%" stopColor="white" stopOpacity={0} />
                        </linearGradient>
                    </GradientDefs>

                    <AreaSeries
                        color={'url(#oceanGradient)'}
                        data={data}
                    />

                    {
                        hoverValues && (
                            <Crosshair
                                values={hoverValues}
                                className={styles.ocean_crosshair}
                            />
                        )
                    }
                    {
                        hoverValues && (
                            <LineSeries
                                strokeWidth={3}
                                className={styles.ocean_line}
                                style={{ strokeLinejoin: "round" }}
                                getX={(d) => hoverValues.x}
                            />
                        )
                    }

                    {
                        hoverValues && (
                            <XAxis tickLabelAngle={-35} />
                        )
                    }

                    {
                        hoverValues && (
                            <MarkSeries className={styles.ocean_crosshair_dot} size={4} data={hoverValues} />
                        )
                    }

                </FlexibleWidthXYPlot>
            </div>
        );
    }
}