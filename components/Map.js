import React, { useEffect } from 'react'
import { StyleSheet, View, Text } from 'react-native'
import tw from 'twrnc';
import MapView, { Marker } from 'react-native-maps';
import { useSelector, useDispatch } from 'react-redux';
import MapViewDirections from 'react-native-maps-directions';
import { useRef } from 'react';

import { selectOrigin, selectDestination, setTravelTimeInformation } from '../slices/navSlice';
import { GOOGLE_MAPS_APIKEY } from '@env';

const Map = () => {
    const origin = useSelector(selectOrigin);
    const destination = useSelector(selectDestination);
    const mapRef = useRef(null);
    const dispatch = useDispatch();

    useEffect(() => {
        if (!origin || !destination) return;

        // Zoom & fit to markers
        mapRef.current.fitToSuppliedMarkers(['origin', 'destination'], {
            edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        });
    }, [origin, destination])

    // Calculate the distance matrix between origin and destination
    useEffect(() => {
        if (!origin || !destination) return;

        const getTravelTime = async () => {
            fetch(
                `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${origin.description}&destinations=${destination.description}&key=${GOOGLE_MAPS_APIKEY}`
            ).then((res) => res.json())
            .then(data => {
                dispatch(setTravelTimeInformation(data.rows[0].elements[0]))
            });
        };

        getTravelTime();
    }, [origin, destination, GOOGLE_MAPS_APIKEY]);

    return (
        <MapView
            ref={mapRef}
            style={tw`flex-1`}
            mapType='mutedStandard'
            initialRegion={{
                latitude: origin.location.lat,
                longitude: origin.location.lng,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
            }}
        >
            {origin && destination && (
                <MapViewDirections 
                    origin={{latitude: origin.location.lat, longitude: origin.location.lng}}
                    destination={{latitude: destination.location.lat, longitude: destination.location.lng}}
                    apikey={GOOGLE_MAPS_APIKEY}
                    onError={(error) => console.error('Error in MapViewDirections:', error)}
                    strokeWidth={3}
                    strokeColor='black'
                />
            )}

            {origin?.location && (
                <Marker 
                    coordinate = {{
                        latitude: origin.location.lat,
                        longitude: origin.location.lng,
                    }}
                    title = 'Origin'
                    description = {origin.description}
                    identifier = 'origin'
                />
            )}

            {destination?.location && (
                <Marker 
                    coordinate = {{
                        latitude: destination.location.lat,
                        longitude: destination.location.lng,
                    }}
                    title = 'Destination'
                    description = {destination.description}
                    identifier = 'destination'
                />
            )}
        </MapView>
    )
}

export default Map

const styles = StyleSheet.create({

})
