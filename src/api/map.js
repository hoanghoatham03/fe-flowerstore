import { API_KEY } from "../utils/appConstant";
import { LOCATION_SHOP } from "../utils/appConstant";

export const getMapfromLocation = async (latitude, longitude) => {
    try {
        const url = `https://rsapi.goong.io/geocode?latlng=${encodeURIComponent(latitude)},${encodeURIComponent(longitude)}&api_key=${API_KEY}`;
        console.log("Geocode URL:", url);
        const response = await fetch(url);
        if (!response.ok) {
            console.error("Geocode Response Status:", response.status);
            console.error("Geocode Response Text:", await response.text());
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error in getMapfromLocation:", error);
        return null;
    }
  };
  
  export const getMapfromLocationShop = async () => {
    try {
        const url = `https://rsapi.goong.io/geocode?latlng=${encodeURIComponent(LOCATION_SHOP.latitude)},${encodeURIComponent(LOCATION_SHOP.longitude)}&api_key=${API_KEY}`;
        console.log("Shop Geocode URL:", url);
        const response = await fetch(url);
        if (!response.ok) {
            console.error("Shop Geocode Response Status:", response.status);
            console.error("Shop Geocode Response Text:", await response.text());
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error in getMapfromLocationShop:", error);
        return null;
    }
  };
  
  export const getLocationfromAddress = async (address) => {
    const url = `https://rsapi.goong.io/geocode?address=${encodeURIComponent(address)}&api_key=${API_KEY}`;
    console.log("Address Geocode URL:", url);
    const response = await fetch(url);
    const data = await response.json();
    return data;
  };
  
  export const autoCompleteAddress = async (keyword) => {
    try {
      const url = `https://rsapi.goong.io/Place/AutoComplete?api_key=${API_KEY}&input=${encodeURIComponent(keyword)}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.predictions || [];
    } catch (error) {
      console.error("Error in autoCompleteAddress:", error);
      return [];
    }
  };
  
  export const getDistance = async (latitude, longitude) => {
    try {
        const url = `https://rsapi.goong.io/DistanceMatrix?origins=${encodeURIComponent(latitude)},${encodeURIComponent(longitude)}&destinations=${encodeURIComponent(LOCATION_SHOP.latitude)},${encodeURIComponent(LOCATION_SHOP.longitude)}&vehicle=car&api_key=${API_KEY}`;
        const response = await fetch(url);
        if (!response.ok) {
            console.error("Distance Response Status:", response.status);
            console.error("Distance Response Text:", await response.text());
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error in getDistance:", error);
        return null;
    }
  };
  
  export const getDirection = async (latitude, longitude, vehicle = "car") => {
    try {
        const url = `https://rsapi.goong.io/Direction?origin=${encodeURIComponent(latitude)},${encodeURIComponent(longitude)}&destination=${encodeURIComponent(LOCATION_SHOP.latitude)},${encodeURIComponent(LOCATION_SHOP.longitude)}&vehicle=${vehicle}&api_key=${API_KEY}`;
        const response = await fetch(url);
        if (!response.ok) {
            console.error("Direction Response Status:", response.status);
            console.error("Direction Response Text:", await response.text());
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error in getDirection:", error);
        return null;
    }
  };
  
  export const getPlaceDetail = async (placeId) => {
    try {
        const url = `https://rsapi.goong.io/Place/Detail?place_id=${placeId}&api_key=${API_KEY}`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.result;
    } catch (error) {
        console.error("Error in getPlaceDetail:", error);
        return null;
    }
  };
  
  