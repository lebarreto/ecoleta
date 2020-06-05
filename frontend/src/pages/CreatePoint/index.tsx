import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft, FiCheckCircle } from 'react-icons/fi';
import { Map, TileLayer, Marker } from 'react-leaflet';
import axios from 'axios';
import { LeafletMouseEvent } from 'leaflet';
import * as Yup from 'yup';

import './styles.css';
import logo from '../../assets/logo.svg';
import api from '../../services/api';
import Dropzone from '../../components/Dropzone';

interface Item {
  id: number;
  title: string;
  image_url: string;
}

interface IbgeUF {
  sigla: string;
}

interface IbgeCity {
  nome: string;
}

const schema = Yup.object().shape({
  name: Yup.string().required('O nome do estabelecimento é obrigatório.'),
  email: Yup.string()
    .email('Insira um e-mail válido.')
    .required('O e-mail é obrigatório.'),
  whatsapp: Yup.string().required(
    'O whatsapp do estabelecimento é obrigatório.',
  ),
  latitude: Yup.number().required(
    'A latitude do estabelecimento é obrigatória.',
  ),
  longitude: Yup.number().required(
    'A longitude do estabelecimento é obrigatória.',
  ),
  city: Yup.string().required('A cidade é obrigatória.'),
  uf: Yup.string().min(2).max(2).required('O estado é obrigatório.'),
  image: Yup.string().required('A imagem do estabelecimento é obrigatória.'),
});

const CreatePoint: React.FC = () => {
  const history = useHistory();

  const [itens, setItens] = useState<Item[]>([]);
  const [uf, setUf] = useState<string[]>([]);
  const [city, setCity] = useState<string[]>([]);

  const [position, setPosition] = useState<[number, number]>([0, 0]);
  const [initialPosition, setInitialPosition] = useState<[number, number]>([
    0,
    0,
  ]);

  const [selectedUF, setSelectedUF] = useState('0');
  const [selectedCity, setSelectedCity] = useState('0');
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [selectedFile, setSelectedFile] = useState<File>();

  const [submitedVisible, setSubmitedVisible] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: '',
  });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      setInitialPosition([latitude, longitude]);
    });
  }, []);

  useEffect(() => {
    api.get('items').then((response) => setItens(response.data));
  }, []);

  useEffect(() => {
    axios
      .get<IbgeUF[]>(
        'https://servicodados.ibge.gov.br/api/v1/localidades/estados',
      )
      .then((response) => {
        const uf = response.data.map((ufs) => ufs.sigla);
        setUf(uf);
      });
  }, []);

  useEffect(() => {
    if (selectedUF === '0') {
      return;
    }

    axios
      .get<IbgeCity[]>(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUF}/municipios`,
      )
      .then((response) => {
        const city = response.data.map((cities) => cities.nome);
        setCity(city);
      });
  }, [selectedUF]);

  function handleSelectedUF(event: ChangeEvent<HTMLSelectElement>) {
    setSelectedUF(event.target.value);
  }

  function handleSelectedCity(event: ChangeEvent<HTMLSelectElement>) {
    setSelectedCity(event.target.value);
  }

  function handleMapClick(event: LeafletMouseEvent) {
    setPosition([event.latlng.lat, event.latlng.lng]);
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    setFormData({ ...formData, [name]: value });
  }

  function handleSelectItem(id: number) {
    const isSelected = selectedItems.findIndex((item) => item === id);

    if (isSelected >= 0) {
      const filteredItems = selectedItems.filter((item) => item !== id);

      setSelectedItems(filteredItems);
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const { name, email, whatsapp } = formData;
    const uf = selectedUF;
    const city = selectedCity;
    const [latitude, longitude] = position;
    const items = selectedItems;

    const data = new FormData();

    data.append('name', name);
    data.append('email', email);
    data.append('whatsapp', whatsapp);
    data.append('uf', uf);
    data.append('city', city);
    data.append('latitude', String(latitude));
    data.append('longitude', String(longitude));
    data.append('items', items.join(','));

    if (selectedFile) {
      data.append('image', selectedFile);
    }

    await api.post('points', data);

    setSubmitedVisible(true);

    window.scrollTo(0, 0);

    setTimeout(() => {
      history.push('/');
    }, 2000);
  }

  return (
    <div id="page-create-point">
      <header>
        <img src={logo} alt="Ecoleta" />
        <Link to="/">
          <FiArrowLeft />
          Voltar para home
        </Link>
      </header>

      <form onSubmit={handleSubmit}>
        <h1>
          Cadastro do <br /> ponto de coleta
        </h1>

        <Dropzone onFileUploaded={setSelectedFile} />

        <fieldset>
          <legend>
            <h2>Dados</h2>
          </legend>

          <div className="field">
            <label htmlFor="name">Nome da entidade</label>
            <input
              type="text"
              name="name"
              id="name"
              onChange={handleInputChange}
            />
          </div>

          <div className="field-group">
            <div className="field">
              <label htmlFor="email">E-mail</label>
              <input
                type="email"
                name="email"
                id="email"
                onChange={handleInputChange}
              />
            </div>
            <div className="field">
              <label htmlFor="whatsapp">WhatsApp</label>
              <input
                type="text"
                name="whatsapp"
                id="whatsapp"
                onChange={handleInputChange}
              />
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Endereço</h2>
            <span>Selecione o endereço no mapa</span>
          </legend>

          <Map center={initialPosition} zoom={15} onClick={handleMapClick}>
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={position} />
          </Map>

          <div className="field-group">
            <div className="field">
              <label htmlFor="uf">Estado (UF)</label>
              <select
                onChange={handleSelectedUF}
                value={selectedUF}
                name="uf"
                id="uf"
              >
                <option value="0">Selecione uma UF</option>
                {uf.map((ufs) => (
                  <option value={ufs} key={ufs}>
                    {ufs}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="city">Cidade</label>
              <select
                onChange={handleSelectedCity}
                value={selectedCity}
                name="city"
                id="city"
              >
                <option value="0">Selecione uma cidade</option>
                {city.map((cities) => (
                  <option value={cities} key={cities}>
                    {cities}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Ítens de coleta</h2>
            <span>Selecione um ou mais ítens abaixo</span>
          </legend>

          <ul className="items-grid">
            {itens.map((item) => (
              <li
                key={item.id}
                onClick={() => handleSelectItem(item.id)}
                className={selectedItems.includes(item.id) ? 'selected' : ''}
              >
                <img src={item.image_url} alt="Lâmpadas" />
                <span>{item.title}</span>
              </li>
            ))}
          </ul>
        </fieldset>

        <button type="submit">Cadastrar ponto de coleta</button>
      </form>
      {submitedVisible && (
        <div className="submitted">
          <p>
            <FiCheckCircle />
            Cadastro concluído!
          </p>
        </div>
      )}
    </div>
  );
};

export default CreatePoint;
