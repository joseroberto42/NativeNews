import React, { useEffect, useState } from 'react';
import { ScrollView, ActivityIndicator, Text, View, StyleSheet } from 'react-native';
import axios from 'axios';
import NewsCard from '../components/NewsCard';

const FavoriteNews = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await axios.get('http://SEU_BACKEND/favorites', {
          headers: { Authorization: `Bearer SEU_TOKEN` },
        });
        setFavorites(response.data);
      } catch (error) {
        console.error('Error fetching favorites:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
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
    <ScrollView style={styles.container}>
      {favorites.map((fav, index) => (
        <NewsCard
          key={index}
          title={fav.title}
          description={fav.description}
          imageUrl={fav.urlToImage}
          newsUrl={fav.url}
          isFavorite={true} // Favorito fixo
          onFavorite={() => {}} // Sem funcionalidade para desfavoritar aqui
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

export default FavoriteNews;
