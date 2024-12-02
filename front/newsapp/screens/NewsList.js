import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  ActivityIndicator,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Ícones
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native'; // Navegação
import NewsCard from '../src/componentes/NewsCard'; // Componente de Card de Notícias

const API_KEY = '2bd9aa80977d4d9d8124356454bf287e'; // Substitua pela sua chave da API News
const BASE_URL = 'https://newsapi.org/v2/top-headlines';
const BACKEND_URL = 'http://localhost:5000/api/favorites/favorites'; // Substitua pela URL do backend

const NewsList = ({ userId }) => {
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]); // Lista de favoritos
  const [selectedCategory, setSelectedCategory] = useState(null);

  const navigation = useNavigation(); // Hook para navegação

  const categories = [
    { label: 'Todos', value: null },
    { label: 'Negócios', value: 'business' },
    { label: 'Entretenimento', value: 'entertainment' },
    { label: 'Geral', value: 'general' },
    { label: 'Saúde', value: 'health' },
    { label: 'Ciência', value: 'science' },
    { label: 'Esporte', value: 'sports' },
    { label: 'Tecnologia', value: 'technology' },
  ];

  const fetchNews = async (category = null) => {
    setLoading(true);
    try {
      const response = await axios.get(BASE_URL, {
        params: {
          country: 'us',
          apiKey: API_KEY,
          category: category,
        },
      });
      setNewsData(response.data.articles);
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  const addFavorite = async (news) => {
    try {
      const token = await AsyncStorage.getItem('authToken');

      if (!token) {
        Alert.alert(
          'Erro de autenticação',
          'Você precisa estar logado para adicionar favoritos.'
        );
        return;
      }

      if (!news.title || !news.url || !news.description || !news.urlToImage) {
        Alert.alert('Erro', 'Faltam informações para adicionar aos favoritos.');
        return;
      }

      const favoriteData = {
        user_id: userId,
        title: news.title,
        description: news.description || '',
        imageUrl: news.urlToImage || '',
        newsUrl: news.url,
      };

      await axios.post(BACKEND_URL, favoriteData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setFavorites((prev) => [...prev, news.title]); // Adiciona o título aos favoritos
    } catch (error) {
      console.error('Error adding favorite:', error);
    }
  };

  const handleCategoryPress = (category) => {
    setSelectedCategory(category);
    fetchNews(category);
  };

  const handleNewsPress = (news) => {
    navigation.navigate('NewsDetails', {
      title: news.title,
      description: news.description,
      imageUrl: news.urlToImage,
      newsUrl: news.url,
    });
  };

  useEffect(() => {
    fetchNews();
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Carregando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Filtros de categorias */}
      <ScrollView
        horizontal
        style={styles.filterScroll}
        contentContainerStyle={styles.filterContainer}
        showsHorizontalScrollIndicator={false}
      >
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.value || 'all'}
            style={[
              styles.filterButton,
              selectedCategory === cat.value && styles.filterButtonActive,
            ]}
            onPress={() => handleCategoryPress(cat.value)}
          >
            <Text
              style={[
                styles.filterButtonText,
                selectedCategory === cat.value && styles.filterButtonTextActive,
              ]}
            >
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Lista de notícias */}
      <View style={styles.cardListContainer}>
        <ScrollView>
          {newsData.map((news, index) => (
            <NewsCard
              key={index}
              title={news.title}
              description={news.description}
              imageUrl={news.urlToImage}
              newsUrl={news.url}
              onFavorite={() => addFavorite(news)}
              isFavorite={favorites.includes(news.title)} // Verifica se já é favorito
              onPress={() => handleNewsPress(news)}
            />
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  filterScroll: {
    maxHeight: 80,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 10,
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  filterButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#eee',
    borderRadius: 20,
    marginHorizontal: 5,
  },
  filterButtonActive: {
    backgroundColor: '#007bff',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  filterButtonTextActive: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  cardListContainer: {
    flex: 1,
    marginTop: 15,
    paddingHorizontal: 10,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default NewsList;
