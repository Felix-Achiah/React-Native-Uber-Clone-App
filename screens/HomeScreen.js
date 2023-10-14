import React from 'react';
import { StyleSheet, View, Text, SafeAreaView, Image } from 'react-native';
import tw from 'twrnc';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { useDispatch, useSelector } from 'react-redux';
import { selectOrigin } from '../slices/navSlice';

import NavOptions from '../components/NavOptions';
import NavFavourities from '../components/NavFavourities';
import { GOOGLE_MAPS_APIKEY } from '@env';
import { setOrigin, setDestination } from '../slices/navSlice';


const HomeScreen = () => {
    const dispatch = useDispatch();
    const origin = useSelector(selectOrigin); 

    return (
        <SafeAreaView style={tw`bg-white h-full`}>
            <View style={tw`p-5`}>
                <Image 
                    style={{
                        width: 100,
                        height: 100,
                        resizeMode: 'contain',
                    }}
                    source={{
                        uri: 'https://links.papareact.com/gzs',
                    }}
                />

                <GooglePlacesAutocomplete 
                    placeholder='Where from?'
                    styles={{
                        container: {
                            flex: 0,
                        },
                        textInput: {
                            fontSize: 18,
                        },
                    }}
                    onPress={(data, details = null) => {
                        dispatch(setOrigin({
                            location: details.geometry.location,
                            description: data.description,
                        }));

                        console.log('Origin State:', origin);

                        dispatch(setDestination(null));

                    }}
                    fetchDetails={true}
                    returnKeyType={'search'}
                    enablePoweredByContainer={false}
                    minLength={2}
                    query={{
                        key: GOOGLE_MAPS_APIKEY,
                        language: 'en',
                    }}
                    nearbyPlaceAPI='GooglePlaceSearch'
                    debounce={400}
                />

                <NavOptions />
                <NavFavourities />
            </View>
        </SafeAreaView>
    )
}

export default HomeScreen;

const styles = StyleSheet.create({

});
