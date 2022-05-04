import React from "react";
import { StyleSheet, ActivityIndicator } from "react-native";
import { Image } from "react-native-elements";
import Carousel from "react-native-snap-carousel";

export default function CarouselImage(props) {
  const { images, width, height } = props;

  const renderItem = ({ item }) => {
    return (
      <Image
        style={{ width, height }}
        PlaceholderContent={
          <ActivityIndicator color="#ffff"></ActivityIndicator>
        }
        source={{ uri: item }}
      ></Image>
    );
  };

  return (
    <Carousel
      layout={"default"}
      data={images}
      sliderWidth={width}
      itemWidth={width}
      itemHeight={height}
      renderItem={renderItem}
    ></Carousel>
  );
}

const styles = StyleSheet.create({});
