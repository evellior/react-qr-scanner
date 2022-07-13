import NimiqQrScanner from 'qr-scanner'
import * as React from 'react'

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
            
            const scanner = new NimiqQrScanner(
                video.current,
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

            if (startOnLaunch ?? true) scanner.start()

            if (onMount) onMount(scanner);
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

export interface QrScannerProps {
    /**
     * Media track constraints object, to specify which camera and capabilities to use
     */
    constraints?: MediaTrackConstraints
    /**
     * Property that represents an optional className to modify styles
     */
    className?: string;
    /**
     * Property that represents a style for the container
     */
    containerStyle?: any;
    /**
     * Property that represents a style for the video container
     */
    videoContainerStyle?: any;
    /**
    * Property that represents a style for the video
    */
    videoStyle?: any;
    /**
     * Property that represents the ID of the video element
     */
    videoId?: string;
    /**
     * Property that represents the view finder component
     */
    ViewFinder?: (props: any) => React.ReactElement<any, any> | null;
    /**
     * Start the camera as soon as the component mounts?
     */
    startOnLaunch?: boolean
    /**
     * A handler to receive the underlying scan controller
     */
    onMount?: (controller: NimiqQrScanner) => null
    /**
     * A handler that can handle both successful and unsuccessful scans
     */
    onScan?: (result?: NimiqQrScanner.ScanResult, error?: Error | string) => void
    /**
     * A handler for successful scans
     */
    onDecode?: (result: NimiqQrScanner.ScanResult) => void
    /**
     * A handler for unsuccessful scans
     */
    onDecodeError?: (error: Error | string) => void
    /**
     * 
     */
    calculateScanRegion?: (video: HTMLVideoElement) => NimiqQrScanner.ScanRegion
    /**
     * The preffered camera, will attempt to use this first
     */
    preferredCamera?: NimiqQrScanner.FacingMode | NimiqQrScanner.DeviceId
    /**
     * 
     */
    maxScansPerSecond?: number;
    /**
     * 
     */
    highlightScanRegion?: boolean;
    /**
     * 
     */
    highlightCodeOutline?: boolean;
    /**
     * 
     */
    overlay?: HTMLDivElement;
    /** just a temporary flag until we switch entirely to the new api */
    returnDetailedScanResult?: true;
}

export default QrScanner;