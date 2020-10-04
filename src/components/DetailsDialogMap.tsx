import React from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import * as atlas from 'azure-maps-control';

import { SimpleScaleBarControl } from './SimpleScaleBarControl';

export const DetailsDialogMapHeight = 550;

// Azure Maps component for showing in the Details dialog
@observer
export class DetailsDialogMap extends React.Component<{ name: string, coordinates: number[], azureMapSubscriptionKey: string }> {

    componentDidMount() {

        // For some reason, DetailsMapDiv isn't available yet at this point, so need to do a setTimeout()
        setTimeout(() => { 

            var map = new atlas.Map('DetailsMapDiv', {

                center: this.props.coordinates,
                zoom: 4,
                style: "road_shaded_relief",
                language: 'en-US',

                authOptions: {
                    authType: atlas.AuthenticationType.subscriptionKey,
                    subscriptionKey: this.props.azureMapSubscriptionKey
                }
            });

            map.events.add('ready', () => {

                //Add a metric scale bar to the map.
                map.controls.add(
                    [
                        new atlas.control.ZoomControl()
                    ],
                    { position: atlas.ControlPosition.BottomRight }
                );

                map.controls.add(
                    [
                        new SimpleScaleBarControl({ units: 'metric' }),
                    ],
                    { position: atlas.ControlPosition.TopRight }
                );

                const mapDataSource = new atlas.source.DataSource();

                mapDataSource.add(new atlas.data.Feature(
                    new atlas.data.Point(this.props.coordinates),
                    { name: this.props.name}));

                map.sources.add(mapDataSource);
                const layer = new atlas.layer.SymbolLayer(mapDataSource, null,
                    {
                        textOptions: {
                            textField: ['get', 'name'],
                            offset: [0, 1.2]
                        }
                    }
                );
                map.layers.add(layer);
            });

        }, 0);
    }

    render(): JSX.Element {

        return ( <MapDiv id="DetailsMapDiv"/> );
    }
}

const MapDiv = styled.div({
    background: '#bebebe',
    height: DetailsDialogMapHeight
})
