import React, { useState, useEffect, useCallback, useRef } from 'react';
import { API_KEY, GOONG_MAPS_KEY, LOCATION_SHOP } from '../utils/appConstant';
import { getMapfromLocation, getDirection, getDistance, autoCompleteAddress, getPlaceDetail } from '../api/map';
import toast from 'react-hot-toast';
import '@goongmaps/goong-js/dist/goong-js.css';
import polyline from '@mapbox/polyline';
import rightArrow from '../assets/right-arrow.png';
import { FaLocationArrow, FaSearch } from 'react-icons/fa';
import DirectMap from './DirectMap';

const VEHICLES = {
  car: { label: 'Ô tô', icon: '🚗' },
  bike: { label: 'Xe máy', icon: '🏍️' },
  taxi: { label: 'Taxi', icon: '🚕' },
  truck: { label: 'Xe tải', icon: '🚚' },
};

const LocationSearch = ({ onLocationSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (query) => {
    setSearchQuery(query || '');
    if (query && query.length > 0) {
      setIsSearching(true);
      try {
        const results = await autoCompleteAddress(query);
        console.log('Search Results:', results);
        setSearchResults(results);
      } catch (error) {
        console.error('Search error:', error);
        toast.error('Không thể tìm kiếm địa điểm');
      }
      setIsSearching(false);
    } else {
      setSearchResults([]);
    }
  };

  const handleSelectPlace = async (result) => {
    try {
      setSearchQuery(result.description || '');
      setSearchResults([]);
      
      const placeDetails = await getPlaceDetail(result.place_id);
      if (!placeDetails || !placeDetails.geometry?.location) {
        throw new Error('Không thể lấy thông tin địa điểm');
      }

      const location = {
        lat: placeDetails.geometry.location.lat,
        lng: placeDetails.geometry.location.lng,
        name: result.description
      };

      onLocationSelect(location);
    } catch (error) {
      console.error('Error selecting place:', error);
      toast.error('Không thể chọn địa điểm này');
    }
  };

  return (
    <div className="relative">
      <div className="flex items-center bg-white rounded-lg shadow-md">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Tìm kiếm địa điểm..."
          className="w-full p-2 rounded-l-lg focus:outline-none"
        />
        <button className="p-2 bg-gray-100 rounded-r-lg">
          <FaSearch className="text-gray-600" />
        </button>
      </div>
      
      {searchResults.length > 0 && (
        <div className="absolute w-full mt-1 bg-white rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
          {searchResults.map((result) => (
            <button
              key={result.place_id}
              onClick={() => handleSelectPlace(result)}
              className="w-full p-2 text-left hover:bg-gray-100 focus:outline-none"
            >
              {result.description}
            </button>
          ))}
        </div>
      )}

      {isSearching && (
        <div className="absolute right-3 top-3">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
        </div>
      )}
    </div>
  );
};

const MapDirections = ({ locationType }) => {
  const [directions, setDirections] = useState(null);
  const [startLocation, setStartLocation] = useState(null);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState('car');
  const [directionSteps, setDirectionSteps] = useState([]);
  const [selectedLocationType, setSelectedLocationType] = useState(null);
  const [searchLocation, setSearchLocation] = useState(null);

  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const routeLayerRef = useRef(null);
  const routeArrowsLayerRef = useRef(null);
  const startMarkerRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  const addRouteArrowsLayer = useCallback((map) => {
    if (!directions || !directions.geometry) return;
    
    map.addSource('routeArrows', {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: directions.geometry,
      },
    });

    map.addLayer({
      id: 'routeArrows',
      type: 'symbol',
      source: 'routeArrows',
      layout: {
        'symbol-placement': 'line',
        'symbol-spacing': 100,
        'icon-image': 'arrow',
        'icon-size': 0.75,
      },
    });
  }, [directions]);

  useEffect(() => {
    if (!mapLoaded && mapContainerRef.current) {
      const script = document.createElement('script');
      script.src = `https://cdn.jsdelivr.net/npm/@goongmaps/goong-js@1.0.9/dist/goong-js.js`;
      script.async = true;

      script.onload = () => {
        if (!mapContainerRef.current) return;
        
        window.goongjs.accessToken = GOONG_MAPS_KEY;
        const map = new window.goongjs.Map({
          container: mapContainerRef.current,
          style: 'https://tiles.goong.io/assets/goong_map_web.json',
          center: [LOCATION_SHOP.longitude, LOCATION_SHOP.latitude],
          zoom: 14,
        });

        map.on('load', () => {
          new window.goongjs.Marker()
            .setLngLat([LOCATION_SHOP.longitude, LOCATION_SHOP.latitude])
            .setPopup(new window.goongjs.Popup().setHTML('<h3 class="font-bold">Cửa hàng</h3>'))
            .addTo(map);

          mapRef.current = map;
          setMapLoaded(true);
        });
      };

      script.onerror = () => {
        toast.error('Không thể tải script bản đồ');
      };

      document.head.appendChild(script);

      return () => {
        if (mapRef.current) {
          mapRef.current.remove();
        }
        document.head.removeChild(script);
      };
    }
  }, []);

  useEffect(() => {
    if (locationType === 'current') {
      getMyLocation();
    }
  }, [locationType]);

  const getMyLocation = useCallback(() => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setStartLocation(location);
          try {
            await getMapfromLocation(location.lat, location.lng);
          } catch (error) {
            toast.error('Không thể tải thông tin chỉ đường');
          } finally {
            setLoading(false);
          }
        },
        (error) => {
          toast.error('Không thể lấy vị trí hiện tại');
          setLoading(false);
        }
      );
    } else {
      toast.error('Trình duyệt của bạn không hỗ trợ Geolocation.');
      setLoading(false);
    }
  }, []);

  const calculateRoute = useCallback(async () => {
    if (!startLocation) return;
    setLoading(true);
    try {
      const directionData = await getDirection(startLocation.lat, startLocation.lng, selectedVehicle);
      console.log('Direction Data:', directionData);

      if (directionData?.routes?.length > 0) {
        const route = directionData.routes[0];
        
        if (route.overview_polyline && route.overview_polyline.points) {
          const decodedPolyline = polyline.decode(route.overview_polyline.points);
          const coordinates = decodedPolyline.map(coord => [coord[1], coord[0]]);

          setDirections({
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: coordinates,
            },
          });

          const steps = route.legs[0].steps.map((step) => ({
            instruction: step.html_instructions,
            distance: step.distance.text,
            duration: step.duration.text,
          }));
          setDirectionSteps(steps);
        } else {
          throw new Error('Không tìm thấy overview_polyline trong dữ liệu chỉ đường.');
        }
      } else {
        throw new Error('Không có tuyến đường nào được trả về từ API.');
      }

      const distanceData = await getDistance(startLocation.lat, startLocation.lng);
      console.log('Distance Data:', distanceData);

      if (distanceData?.rows?.[0]?.elements?.[0]) {
        const element = distanceData.rows[0].elements[0];
        setDistance(element.distance.text);
        setDuration(element.duration.text);
      } else {
        throw new Error('Không tìm thấy dữ liệu khoảng cách.');
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Không thể tải thông tin chỉ đường');
    } finally {
      setLoading(false);
    }
  }, [startLocation, selectedVehicle]);

  useEffect(() => {
    if (startLocation && selectedVehicle) {
      calculateRoute();
    }
  }, [calculateRoute, selectedVehicle, startLocation]);

  useEffect(() => {
    if (mapLoaded && mapRef.current && directions && directions.geometry && directions.geometry.coordinates) {
      const map = mapRef.current;
      const coordinates = directions.geometry.coordinates;

      const updateLayers = () => {
        try {
          ['route', 'routeArrows'].forEach(layerId => {
            if (map.getLayer(layerId)) {
              map.removeLayer(layerId);
            }
            if (map.getSource(layerId)) {
              map.removeSource(layerId);
            }
          });

          map.addSource('route', {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: directions.geometry,
            },
          });

          map.addLayer({
            id: 'route',
            type: 'line',
            source: 'route',
            paint: {
              'line-color': '#ff0000',
              'line-width': 4,
              'line-opacity': 0.8,
            },
            layout: {
              'line-cap': 'round',
              'line-join': 'round',
            },
          });

          if (map.hasImage('arrow')) {
            addRouteArrowsLayer(map);
          } else {
            const arrowUrl = rightArrow;
            map.loadImage(arrowUrl, (error, image) => {
              if (error) {
                console.error('Error loading arrow image:', error);
                return;
              }
              if (!map.hasImage('arrow')) {
                map.addImage('arrow', image);
              }
              addRouteArrowsLayer(map);
            });
          }

          const bounds = coordinates.reduce(
            (bounds, coord) => bounds.extend(coord),
            new window.goongjs.LngLatBounds(coordinates[0], coordinates[0])
          );
          map.fitBounds(bounds, { padding: 50 });

          if (startLocation && startLocation.lat && startLocation.lng) {
            if (startMarkerRef.current) {
              startMarkerRef.current.setLngLat([startLocation.lng, startLocation.lat]);
            } else {
              startMarkerRef.current = new window.goongjs.Marker({ color: '#ff0000' })
                .setLngLat([startLocation.lng, startLocation.lat])
                .setPopup(new window.goongjs.Popup().setHTML('<h3 class="font-bold">Vị trí của bạn</h3>'))
                .addTo(map);
            }
          }
        } catch (error) {
          console.error('Error updating map layers:', error);
          toast.error('Có lỗi khi cập nhật bản đồ');
        }
      };

      if (!map.isStyleLoaded()) {
        map.on('load', updateLayers);
      } else {
        updateLayers();
      }
    }
  }, [directions, mapLoaded, startLocation]);

  const stripHtml = (html) => {
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  const handleMyLocation = useCallback(() => {
    setSelectedLocationType('current');
    getMyLocation();
  }, [getMyLocation]);

  const handleSearchLocation = useCallback((location) => {
    setSelectedLocationType('search');
    setSearchLocation(location);
    setStartLocation({
      lat: location.lat,
      lng: location.lng
    });
  }, []);

  const handleInitialState = useCallback(() => {
    if (locationType === 'current') {
      getMyLocation();
    }
  }, [locationType, getMyLocation]);

  useEffect(() => {
    handleInitialState();
  }, [handleInitialState]);

  return (
    <div className="h-[600px] w-full relative flex">
      <div className="w-3/4 relative">
        {loading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        )}

        <div className="absolute top-4 left-4 z-10 space-y-2 w-80">
          <LocationSearch onLocationSelect={handleSearchLocation} />
          <button
            onClick={handleMyLocation}
            className="w-full flex items-center justify-center space-x-2 p-2 bg-white rounded-lg shadow-md hover:bg-gray-50"
          >
            <FaLocationArrow className="text-blue-500" />
            <span>Vị trí của tôi</span>
          </button>
        </div>

        <div className="absolute top-4 right-4 z-10 bg-white p-4 rounded-lg shadow-lg">
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(VEHICLES).map(([key, value]) => (
              <button
                key={key}
                onClick={() => setSelectedVehicle(key)}
                className={`flex items-center space-x-2 p-2 rounded ${
                  selectedVehicle === key ? 'bg-blue-500 text-white' : 'bg-gray-100'
                }`}
              >
                <span>{value.icon}</span>
                <span>{value.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div 
          ref={mapContainerRef}
          className="w-full h-full"
        />
      </div>

      <div className="w-1/4 bg-white p-4 overflow-y-auto">
        {distance && duration && (
          <>
            <div className="mb-4">
              <h3 className="font-bold text-lg">Tổng quãng đường</h3>
              <p>Khoảng cách: {distance}</p>
              <p>Thời gian: {duration}</p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">Chỉ đường chi tiết</h3>
              <div className="space-y-3">
                {directionSteps.map((step, index) => (
                  <div key={index} className="border-b pb-2">
                    <div className="text-sm">
                      {stripHtml(step.instruction)}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {step.distance} - {step.duration}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MapDirections;
