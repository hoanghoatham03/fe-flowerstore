import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import PropTypes from "prop-types";

const Category = ({ route, navigation }) => {
  const { id, name } = route.params; 

  return (
    <View className="flex-1 bg-white">
      <View className="flex-row items-center p-4 border-b border-gray-300">

        <TouchableOpacity
          onPress={() => navigation.goBack()} 
          className="mr-4"
        >
          <Text className="text-xl text-black">{'<'}</Text>
        </TouchableOpacity>

        <Text className="text-lg font-bold">{name}</Text>
      </View>

      <View className="flex-1 p-4">
        <Text>Product list for Category {name} (ID: {id})</Text>
       
      </View>
    </View>
  );
};
Category.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  navigation: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
  }).isRequired,
};

export default Category;
