import React, { useState, useEffect } from "react";
import { Image, ImageBackground, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import RNPickerSelect from "react-native-picker-select";

import {
  Main,
  Title,
  Description,
  Footer,
  Button,
  ButtonIcon,
  ButtonText,
} from "./styles";

interface IbgeUF {
  sigla: string;
}

interface IbgeCity {
  id: number;
  nome: string;
}

interface Option {
  key: string;
  value: string;
  label: string;
}

const Home: React.FC = () => {
  const navigation = useNavigation();

  const [ufs, setUfs] = useState<Option[]>([]);
  const [cities, setCities] = useState<Option[]>([]);

  const [selectedUf, setSelectedUf] = useState("0");
  const [selectedCity, setSelectedCity] = useState("0");

  useEffect(() => {
    axios
      .get<IbgeUF[]>(
        "https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome"
      )
      .then(response => {
        const ufInitials = response.data.map(uf => ({
          key: uf.sigla,
          value: uf.sigla,
          label: uf.sigla,
        }));
        setUfs(ufInitials);
      });
  }, []);

  useEffect(() => {
    if (selectedUf === "0") {
      return;
    }
    axios
      .get<IbgeCity[]>(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios?orderBy=nome`
      )
      .then(response => {
        const cities = response.data.map(city => ({
          key: String(city.id),
          value: city.nome,
          label: city.nome,
        }));
        setCities(cities);
      });
  }, [selectedUf]);

  return (
    <ImageBackground
      source={require("../../assets/home-background.png")}
      style={styles.container}
      imageStyle={{ width: 274, height: 368 }}
    >
      <Main>
        <Image source={require("../../assets/logo.png")} />
        <Title>Seu marketplace de coleta de resíduos.</Title>
        <Description>
          Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.
        </Description>
      </Main>

      <Footer>
        <RNPickerSelect
          style={{ ...pickerSelectStyles }}
          placeholder={{
            label: "Selecione um estado",
            value: null,
          }}
          onValueChange={value => setSelectedUf(value)}
          items={ufs}
        />

        <RNPickerSelect
          style={{ ...pickerSelectStyles }}
          placeholder={{
            label: "Selecione uma cidade",
            value: null,
          }}
          onValueChange={value => setSelectedCity(value)}
          items={cities}
        />

        <Button
          onPress={() =>
            navigation.navigate("Points", {
              uf: selectedUf,
              city: selectedCity,
            })
          }
        >
          <ButtonIcon>
            <Feather name="arrow-right" color="#fff" size={24} />
          </ButtonIcon>
          <ButtonText>Entrar</ButtonText>
        </Button>
      </Footer>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    height: 60,
    backgroundColor: "#fff",
    fontSize: 16,
    marginBottom: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  inputAndroid: {
    height: 60,
    backgroundColor: "#fff",
    fontSize: 16,
    marginBottom: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
});

export default Home;
