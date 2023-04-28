import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Line } from 'react-native-svg';


const FrameEdge = ({ width, height }: any) => {

    return (
        <View style={styles({ width, height }).frameRoot}>
            <View
                style={{
                    position: 'absolute',
                    height: height / 1.1,
                    left: width / 8,
                    top: height * 0.05,
                    width: width / 1.3,
                }}
            >
                <Svg width={width / 1.3} height={height / 1.1} >
                    <Line x1='0' x2='0' y1='0' y2='25%' stroke='#ffb44f'
                        strokeWidth={10} />
                    <Line x1='0' x2='15%' y1='0' y2='0' stroke='#ffb44f'
                        strokeWidth={10} />

                    <Line
                        x1='100%'
                        x2='100%'
                        y1='0'
                        y2='25%'
                        stroke='#ffb44f'
                        strokeWidth={10}
                    />
                    <Line x1='100%' x2='85%' y1='0' y2='0' stroke='#ffb44f'
                        strokeWidth={10} />

                    <Line x1='0' x2='15%' y1='100%' y2='100%' stroke='#ffb44f'
                        strokeWidth={10} />
                    <Line x1='0' x2='0' y1='100%' y2='75%' stroke='#ffb44f'
                        strokeWidth={10} />

                    <Line
                        x1='100%'
                        x2='85%'
                        y1='100%'
                        y2='100%'
                        stroke='#ffb44f'
                        strokeWidth={10}
                    />
                    <Line
                        x1='100%'
                        x2='100%'
                        y1='100%'
                        y2='75%'
                        stroke='#ffb44f'
                        strokeWidth={10}
                    />
                </Svg>
            </View>
            {/* <View
              style={styles({ width, height }).videoFrame}
              // style={{
              //   background: !lastJsonMessage?.isPassed
              //     ? 'linear-gradient(156.43deg, rgba(255, 180, 79, 0.21) 0%, rgba(255, 60, 71, 0.65) 100%)'
              //     : 'linear-gradient(156.43deg, rgba(24, 255, 255, 0.22275) 0%, #00B8D4 100%)',
              // }}
            ></View> */}
        </View>
    )
}

export default FrameEdge;


const styles = (orientation: any) => StyleSheet.create({
    frameRoot: {
        width: orientation?.width * 0.7,
        height: orientation?.height,
        position: 'absolute'
    },
    // videoFrame: {
    //   position: 'absolute',
    //   zIndex: 1,
    //   marginRight: 'calc(100%/3)',
    //   width: orientation.width/2,
    //   height: orientation.height / 1.1,
    //   left: orientation.width/8,
    //   // top: 5vh,
    //   opacity: 0.5,
    //   boxShadow:
    //     '0px 0px 41px #FFB44F, 0px 0px 17.8734px rgba(24, 255, 255, 0.22275), 0px 0px 6.6625px #FFB44F, 0px 0px 2.37031px rgba(24, 255, 255, 0.10725)',
    //   borderRadius: 8,
    //   background:
    //     'linear-gradient(156.43deg, rgba(24, 255, 255, 0.22275) 0%, #00B8D4 100%)',
    // }
})