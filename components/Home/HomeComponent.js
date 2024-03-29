import React from 'react';
import { 
  StatusBar, 
  Dimensions,
  View, 
  StyleSheet, 
  TouchableOpacity, 
  Text, 
  TextInput, 
  FlatList, 
  ScrollView,
  Image
} from 'react-native';


import { AppRegistry } from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';

import {Card} from 'native-base';

import {productService} from '../../services/productService';

import _ from 'lodash';


const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);

import ModalAddProduct from './components/ModalAddProduct';

export default class Home extends React.Component {
  constructor() {
    super();
    this.state = {
      isLoaded: false,
      fontLoaded: false,
      isConected: true,
      products: [],
      soldProducts: [],
      modalVisible: false,
      productSelected: null
    };

    this.products= [];
    this.soldProducts = [];

    
  }

  async componentWillMount() {
    //this.setState({ isReady: true, fontLoaded: true });
  }



  async componentDidMount() {

    this.loadProducts();

  }

  async loadProducts () {
    this.setState({soldProducts: []});
    const response = await productService.getAll();
    this.products = response.data;

    const soldProducts = this.filterBySoldProducts(response.data);
    this.soldProducts = soldProducts;
    this.setState({soldProducts})
    this.setState({isLoaded: true})
  }

  filterBySoldProducts (products) {
   return _.filter(products, {'isSold': true})
  }

  componentWillUnmount() {
   
  }

  searchedProducts = (searchedText) => {
    if(searchedText.length > 0 ) {
      this.setState({soldProducts: []});

      const searchedProducts = this.products.filter(function(product) {
        return product.productName.toLowerCase().indexOf(searchedText.toLowerCase()) > -1;
      });
    
      if(searchedProducts.length > 0) {
        this.setState({soldProducts: searchedProducts});
      } else {
        console.log('here')
        this.setState({soldProducts: [{addProductButton: true}]});
      }
      
    } else  {
      this.setState({soldProducts: this.soldProducts});
    }
  
  };

  async updateProductIsSold (id) {
   this.state.products = [];
   const result = await productService.updateIsSold(id);
   this.loadProducts();
  }

  renderProducts = (product) => {
   
      return (
        <TouchableOpacity onPress={() => this.updateProductIsSold(product.id)}>
          <Card style={{flex: 1, padding: 10}}>
          <View>
            <Text style={{fontFamily: 'Roboto'}}>{product.productName}</Text>
          </View>
          </Card>
        </TouchableOpacity>
      );
   
  };

  openAddProductModal (product) {
    console.log('price', product.price)
    this.setState({productSelected: product })
    this.setState({modalVisible: true })
    if(!product.isSold) {
      this.updateProductIsSold(product.id);
    }

  }

  renderCardProduct (product) {
    const cardWidth = screenWidth / 4.5;
    const cardHeight = screenHeight / 8;

    if(product.addProductButton ) {
      return (
        <Card><Text>Nuevo</Text></Card>
      );
    } else {
      const productName = (product.imageUrl) ? product.productName.substring(0, 11) : product.productName;
      return (
        <TouchableOpacity onPress={() => this.openAddProductModal(product)}>
          <Card style={{width:cardWidth, height: cardHeight, marginRight: 5, flex: 1, padding: 10}}>
            {
              product.imageUrl ? (
                <View style={{flex:1, flexGrow: 10, justifyContent: 'center', alignItems: 'center'}}>
                  <Image   source={{uri: product.imageUrl}} style={{ height: null,
                      width: '100%',flex: 1}}/>
                </View>   
              ) : null
            }
            
  
            <View style={{flexGrow: 1, justifyContent: 'center', alignItems: 'center'}}>
              <Text style={{fontFamily: 'Roboto', fontSize: 10}}>{productName}</Text>
            </View>
          </Card>
        </TouchableOpacity>
      );
    }

    
  }

  closeModal() {
    this.setState({modalVisible: false})
  }



  render() {
    console.log('render')
    if(this.state.isLoaded) {
      console.log('loaded')
    return (
      <View style={styles.container}>
          <LinearGradient colors={['#4dd0e1', '#18ffff']} style={{flexDirection: 'row', flexGrow: 1}} start={[0, 0]} end={[0.6, 0]}></LinearGradient>
          <View style={{flexGrow: 8, padding: 10}}>

          <View style={{flexGrow: 1}}>
            <Card style={{flex: 1}}>
              <TextInput 
                style={styles.textinput}
                onChangeText={this.searchedProducts}
                placeholder="Busca tu producto Aqui" />
            </Card>
          </View>
       
    
      <View style={{flexGrow: 10}}>
        <ScrollView style={{height: 100}}>
          <FlatList
              data={this.state.soldProducts}
              keyExtractor={(item, index) => index.toString()}
              numColumns={4}
              renderItem={({item}) => this.renderCardProduct(item)} />
          </ScrollView>
      </View>


          </View>
          {
            this.state.productSelected ? (
              <ModalAddProduct closeModal={this.closeModal.bind(this)} product={this.state.productSelected} isVisible={this.state.modalVisible}></ModalAddProduct>
            ) : null
          }
         
      </View>
    )
  } else {
    return null;
  }

}

}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa'
  },
  textinput: {
    flex: 1
  }
  
 
});

AppRegistry.registerComponent('App', () => App);
