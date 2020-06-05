import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  SafeAreaView,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SvgUri } from "react-native-svg";
import * as Location from "expo-location";

import api from "../../services/api";
import {
  Title,
  Description,
  MapContainer,
  Map,
  ItemsContainer,
  ItemTitle,
  Item,
  MapMarkerContainer,
  MapMarker,
  MapMarkerTitle,
  Container,
} from "./styles";

interface Item {
  id: number;
  title: string;
  image_url: string;
}

interface Points {
  id: number;
  image: string;
  name: string;
  latitude: number;
  longitude: number;
}

interface Params {
  uf: string;
  city: string;
}

const Points: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const routeParams = route.params as Params;

  const [items, setItems] = useState<Item[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const [points, setPoints] = useState<Points[]>([]);

  const [initialPosition, setInitialPosition] = useState<[number, number]>([
    0,
    0,
  ]);

  useEffect(() => {
    async function loadPosition() {
      const { status } = await Location.requestPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Ooooops...",
          "Precisamos de sua permissão para obter a localização"
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync();

      const { latitude, longitude } = location.coords;

      console.log(latitude, longitude);

      setInitialPosition([latitude, longitude]);
    }

    loadPosition();
  }, []);

  useEffect(() => {
    api
      .get("points", {
        params: {
          city: routeParams.city,
          uf: routeParams.uf,
          items: selectedItems,
        },
      })
      .then(response => setPoints(response.data));
  }, [selectedItems]);

  useEffect(() => {
    api.get("items").then(response => setItems(response.data));
  }, []);

  function handleSelectItem(id: number) {
    const isSelected = selectedItems.findIndex(item => item === id);

    if (isSelected >= 0) {
      const filteredItems = selectedItems.filter(item => item !== id);

      setSelectedItems(filteredItems);
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Container>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={20} color="#34cb79" />
        </TouchableOpacity>

        <Title>Bem vindo.</Title>
        <Description>Encontre no mapa um ponto de coleta.</Description>

        <MapContainer>
          {initialPosition[0] !== 0 && (
            <Map
              loadingEnabled={initialPosition[0] === 0}
              initialRegion={{
                latitude: initialPosition[0],
                longitude: initialPosition[1],
                latitudeDelta: 0.014,
                longitudeDelta: 0.014,
              }}
            >
              {points.map(point => (
                <MapMarker
                  key={String(point.id)}
                  coordinate={{
                    latitude: point.latitude,
                    longitude: point.longitude,
                  }}
                  onPress={() =>
                    navigation.navigate("Detail", { point_id: point.id })
                  }
                >
                  <MapMarkerContainer>
                    <Image
                      source={{
                        uri: point.image,
                      }}
                      style={styles.mapMarkerImage}
                    />
                    <MapMarkerTitle>{point.name}</MapMarkerTitle>
                  </MapMarkerContainer>
                </MapMarker>
              ))}
            </Map>
          )}
        </MapContainer>
      </Container>
      <ItemsContainer onPress={() => {}}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20 }}
        >
          {items.map(item => (
            <Item
              key={String(item.id)}
              onPress={() => handleSelectItem(item.id)}
              activeOpacity={0.6}
              style={[
                selectedItems.includes(item.id) ? styles.selectedItem : {},
              ]}
            >
              <SvgUri width={42} height={42} uri={item.image_url} />
              <ItemTitle>{item.title}</ItemTitle>
            </Item>
          ))}
        </ScrollView>
      </ItemsContainer>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mapMarkerImage: {
    width: 90,
    height: 45,
    resizeMode: "cover",
  },
  selectedItem: {
    borderColor: "#34CB79",
    borderWidth: 2,
  },
});

export default Points;
