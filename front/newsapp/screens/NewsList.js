import React, { useEffect, useState } from 'react';
import { ScrollView, ActivityIndicator, Text, View, StyleSheet } from 'react-native';
import axios from 'axios';
import NewsCard from '../components/NewsCard';

const NewsList = () => {
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get('https://newsapi.org/v2/top-headlines', {
          params: { country: 'us', apiKey: 'SUA_API_KEY' },
        });
        setNewsData(response.data.articles);
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchFavorites = async () => {
      try {
        const response = await axios.get('http://SEU_BACKEND/favorites', {
          headers: { Authorization: `Bearer SEU_TOKEN` },
        });
        setFavorites(response.data);
      } catch (error) {
        console.error('Error fetching favorites:', error);
      }
    };

    fetchNews();
    fetchFavorites();
  }, []);

  const toggleFavorite = async (item) => {
    try {
      const isFavorite = favorites.some((fav) => fav.item_id === item.id);
      if (isFavorite) {
        await axios.delete(`http://SEU_BACKEND/favorites/${item.id}`, {
          headers: { Authorization: `Bearer SEU_TOKEN` },
        });
        setFavorites(favorites.filter((fav) => fav.item_id !== item.id));
      } else {
        await axios.post(
          'http://SEU_BACKEND/favorites',
          { item_id: item.id },
          { headers: { Authorization: `Bearer SEU_TOKEN` } },
        );
        setFavorites([...favorites, { item_id: item.id }]);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Carregando...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {newsData.map((news, index) => (
        <NewsCard
          key={index}
          title={news.title}
          description={news.description}
          imageUrl={news.urlToImage}
          newsUrl={news.url}
          isFavorite={favorites.some((fav) => fav.item_id === news.id)}
          onFavorite={() => toggleFavorite(news)}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default NewsList;
