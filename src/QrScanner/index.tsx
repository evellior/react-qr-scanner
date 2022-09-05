import * as React from 'react'
import NimiqQrScanner from 'qr-scanner'
import { QrScannerProps } from '../types';

const styles: any = {
    container: {
        width: '100%',
        paddingTop: '100%',
        overflow: 'hidden',
        position: 'relative',
    },
    video: {
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'block',
        overflow: 'hidden',
        position: 'absolute',
        transform: undefined,
    },
};

const QrScanner = (props: QrScannerProps) => {
    const {
        constraints,
        className,
        containerStyle,
        videoContainerStyle,
        videoStyle,
        videoId,
        ViewFinder,
        startOnLaunch,
        onMount,
        onScan,
        onDecode,
        onDecodeError,
        calculateScanRegion,
        preferredCamera,
        maxScansPerSecond,
        highlightScanRegion,
        highlightCodeOutline,
        overlay,
        returnDetailedScanResult,
    } = props

    const video = React.createRef<HTMLVideoElement>();

    React.useEffect(() => {
        if (video.current) {
            // create scanner bound to video html element
            let target = video.current
            
            var scanner = new NimiqQrScanner(
                target,
                result => {
                    if (onDecode) onDecode(result);
                    if (onScan) onScan(result);
                }, 
                {
                    onDecodeError: error => {
                        if (onDecodeError) onDecodeError(error);
                        if (onScan) onScan(undefined, error);
                    },
                    calculateScanRegion,
                    preferredCamera,
                    maxScansPerSecond,
                    highlightScanRegion,
                    highlightCodeOutline,
                    overlay,
                    returnDetailedScanResult
                }
            )

            if (startOnLaunch) scanner.start().then(
                _ => {/*Started successfully*/},
                err => console.log("Error starting scanner: ", err)
            )

            if (onMount) onMount(scanner);

            return () => {
                // dispose of component
                scanner.destroy()
            }
        }
    }, [])

    return (
        <section className={className} style={containerStyle}>
            <div
                style={{
                ...styles.container,
                ...videoContainerStyle,
                }}
            >
                {!!ViewFinder && <ViewFinder />}
                <video
                    ref={video} 
                    muted
                    id={videoId}
                    style={{
                        ...styles.video,
                        ...videoStyle,
                        transform: constraints?.facingMode === 'environment' && 'scaleX(-1)',
                    }}
                />
            </div>
        </section>
    );
}

export default QrScanner;