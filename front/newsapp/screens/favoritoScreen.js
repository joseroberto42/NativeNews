import React, { useEffect, useState } from 'react';
import { ScrollView, ActivityIndicator, Text, View, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NewsCard from '../src/componentes/NewsCard';  // Certifique-se de que NewsCard esteja correto

const FavoriteNews = () => {
  const [favorites, setFavorites] = useState([]);  // Armazena as notícias favoritas
  const [loading, setLoading] = useState(true);    // Controle de estado de carregamento

  // Hook de efeito que é executado quando o componente é montado
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        // Recupera o token de autenticação do AsyncStorage
        const token = await AsyncStorage.getItem('authToken');
        
        if (token) {
          // Requisição ao backend para obter as notícias favoritas com o token de autenticação
          const response = await axios.get('http://localhost:5000/api/favorites/favorites', {
            headers: { Authorization: `Bearer ${token}` },  // Passando o token de autenticação
          });
          setFavorites(response.data);  // Atualiza o estado com as notícias favoritas
        } else {
          console.error('Token não encontrado!');
        }
      } catch (error) {
        console.error('Error fetching favorites:', error);  // Captura qualquer erro
      } finally {
        setLoading(false);  // Finaliza o carregamento
      }
    };

    fetchFavorites();  // Chama a função para buscar as notícias favoritas ao montar o componente
  }, []);  // O array vazio [] faz com que o efeito rode apenas uma vez

  // Se estiver carregando, exibe o indicador de carregamento
  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Carregando...</Text>
      </View>
    );
  }

  // Se não houver notícias favoritas, exibe uma mensagem
  if (favorites.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.noFavoritesText}>Você ainda não tem notícias favoritas.</Text>
      </View>
    );
  }

  // Exibe as notícias favoritas
  return (
    <ScrollView style={styles.container}>
      {favorites.map((fav) => (
        <NewsCard
          key={fav.id}
          title={fav.title}
          description={fav.description}
          imageUrl={fav.urlToImage}
          newsUrl={fav.url}
          isFavorite={true}  // Indicando que já é favorito
          onFavorite={() => {}}  // Sem funcionalidade de desfavoritar nesta tela
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',  // Cor de fundo para a tela
    padding: 10,  // Adiciona padding para as bordas
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noFavoritesText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
    color: '#888',  // Cor da mensagem quando não há favoritos
  },
});

export default FavoriteNews;
