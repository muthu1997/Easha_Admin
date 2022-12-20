import React from "react";
import { Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";
import * as COLOUR from "../constants/colors";

export function LineChartFunction(props) {
    return (
        <LineChart
            data={{
                labels: props.labels,
                datasets: [
                    {
                        data: props.data
                    }
                ]
            }}
            width={Dimensions.get("screen").width - 25} // from react-native
            height={220}
            yAxisSuffix="k"
            yLabelsOffset={5}
            yAxisInterval={1} // optional, defaults to 1
            chartConfig={{
                backgroundColor: COLOUR.WHITE,
                backgroundGradientFrom: COLOUR.WHITE,
                backgroundGradientTo: COLOUR.WHITE,
                decimalPlaces: 0, // optional, defaults to 2dp
                color: (opacity = 1) => COLOUR.PRIMARY,
                labelColor: (opacity = 1) => COLOUR.BLACK,
                style: {
                    borderRadius: 16
                },
                propsForDots: {
                    r: "6",
                    strokeWidth: "2",
                    stroke: COLOUR.WHITE
                }
            }}
            bezier
            style={{
                marginVertical: 8,
                borderRadius: 16
            }}
        />
    )
}