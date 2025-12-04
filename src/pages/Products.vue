<script setup lang="ts">
import {products} from "../data/products"
import { ShoppingCart, Star, Filter, Heart, Plus, Home, Package } from "lucide-vue-next"
import { computed, ref } from "vue"
import { useRouter } from "vue-router"
import {useCartStore} from "../stores/cart"

const router= useRouter()
const cartStore= useCartStore()

const goToCart= ()=> {
  router.push("/cart")
}

// star rating
const getStars= (rating: number) =>{
  const stars= []
  for (let i=1; i<= 5; i++){
    stars.push({
      filled: i <= rating
    })
  }
  return stars
}

// sort
const sortOption= ref<string>('popular')
const sortedProducts= computed(()=> {
  const productsCopy= [...products]

  switch(sortOption.value){
    case 'price-low':
      return productsCopy.sort((a, b)=> a.price - b.price)
    case 'price-high':
      return productsCopy.sort((a, b)=> b.price - a.price)
    case 'popular':
    default:
      return productsCopy.sort((a, b)=> b.rating - a.rating)
  }
})

// pagination
const currentPage= ref(1)
const perPage= 8
const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * perPage
  return sortedProducts.value.slice(start, start + perPage)
})
const totalPages = computed(() =>
  Math.ceil(sortedProducts.value.length / perPage)
)
const goToPage = (n: number) => {
  if (n >= 1 && n <= totalPages.value) {
    currentPage.value = n
  }
}

// handler
const handleSortChange= (event: Event)=> {
  const target= event.target as HTMLSelectElement
  sortOption.value= target.value
  currentPage.value= 1
}

const addToCart = (product: typeof products[0]) => {
  cartStore.addToCart({
    id: product.id,
    name: product.name,
    price: product.price,
    image: product.image,
    rating: product.rating,
    stock: product.stock,
    description: product.description
  })
}
const canAddToCart = (product: typeof products[0]) => {
  const currentQuantity = cartStore.getQuantity(product.id)
  return currentQuantity < product.stock
}

</script>

<template>
  <!-- Header -->
  <header class="sticky top-0 z-50 bg-gradient-to-r from-purple-700 to-purple-900 text-white px-6 py-4 shadow-xl">
    <div class="container mx-auto flex justify-between items-center">
      <div  class="flex items-center gap-3">
        <div class="w-10 h-10 bg-white rounded-full flex items-center justify-center">
          <span class="text-purple-800 font-bold text-xl">B</span>
        </div>
        <h1 class="text-2xl font-bold tracking-wider">BeautyMart</h1>
      </div>

      <div class="relative group ">
          <div class="flex items-center gap-2 bg-purple-800 hover:bg-purple-700 px-4 py-2 rounded-xl transition-all">
            <ShoppingCart class="w-6 h-6" />
            <span class="font-medium">Cart</span>
            <span
              class="absolute -top-2 -right-2 bg-yellow-400 text-purple-900 font-bold text-xs rounded-full w-6 h-6 flex items-center justify-center">
              {{ cartStore.totalItems }}
            </span>
          </div>

          <div
            class="absolute right-0 mt-2 w-72 bg-white text-gray-800 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 p-4">
            <p class="font-semibold mb-2">Cart Preview</p>
            <p v-if="cartStore.totalItems > 0" class="text-sm text-gray-600">{{ cartStore.totalItems }} item{{ cartStore.totalItems !== 1 ? 's' : '' }} • 
              ${{ cartStore.subTotal.toFixed(2) }}</p>
            <p v-else class="text-sm text-gray-600">Your cart is empty</p>

            <button @click="goToCart" class="w-full mt-3 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition-colors cursor-pointer">
              View Cart
            </button>
          </div>
        </div>
    </div>
  </header>

  

  <!-- Main -->
  <main class="container mx-auto px-4 py-12">
    <div class="flex flex-col md:flex-row justify-between items-center mb-10">
      <div>
        <h2 class="text-4xl font-bold text-gray-900 mb-2">Product Catalog</h2>
        <p class="text-gray-600">Browse our premium collection of beauty products</p>
      </div>

      <!-- Sort & Filter -->
      <div class="flex gap-4 mt-4 md:mt-0">
        <select @change="handleSortChange" class="border border-gray-300 rounded-lg px-4 py-2">
          <option value="popular">Sort by: Popular</option>
          <option value="price-low">Sort by: Price Low to High</option>
          <option value="price-high">Sort by: Price High to Low</option>
        </select>

        <button class="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg">
          <Filter class="w-5 h-5" />
          Filter
        </button>
      </div>
    </div>

    <!-- Product Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      <div v-for="p in paginatedProducts" :key="p.id"
        class="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border flex flex-col transform hover:-translate-y-1">

        <div class="relative overflow-hidden">
          <img :src="p.image" :alt="p.name"
            class="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500" />

          <div class="absolute top-4 right-4">
            <button class="bg-white/90 hover:bg-white p-2 rounded-full shadow-md">
              <Heart class="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </div>

        <div class="p-6 flex-1 flex flex-col">
          <div class="flex-1">
            <h3 class="text-xl font-bold text-gray-900 group-hover:text-purple-700 transition-colors mb-2">
              {{ p.name }}
            </h3>

            <div class="flex items-center gap-2 mb-3">
              <div class="flex">
                <Star v-for="(s, i) in getStars(p.rating)" :key="i" class="w-4 h-4" :class="s.filled ? 'text-yellow-400' : 'text-gray-300' " /> 
              </div>
              <span class="text-gray-500 text-sm">({{ p.rating }})</span>
            </div>

            <p class="text-gray-600 text-sm mb-4 line-clamp-2">
              {{ p.description }}.
            </p>
          </div>

          <div class="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <div>
              <p class="text-2xl font-bold text-purple-700">Rp {{ p.price }}</p>
              <p class="text-sm text-gray-500 ">Stock: {{ p.stock }} item</p>
            </div>

            <button
              @click="addToCart(p)"
              :disabled="!canAddToCart(p)"
              :class="[
                'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-5 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-md cursor-pointer',
                !canAddToCart(p) ? 'opacity-50 cursor-not-allowed' : ''
              ]">
              <Plus class="w-5 h-5" />
              {{ canAddToCart(p) ? 'Add to Cart' : 'Out of Stock' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="flex justify-center items-center gap-2 mt-16"> 
      <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1" class="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"> Previous </button> 
      <button v-for="n in totalPages" :key="n" @click="goToPage(n)"
        :class="currentPage === n ? 'bg-purple-600 text-white' : 'border border-gray-300'"
        class="px-4 py-2 rounded-lg hover:bg-gray-50">
        {{ n }}
      </button>
      <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages" class="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"> Next </button> 
    </div>
  </main>

  <footer class="bg-gradient-to-r from-purple-900 to-purple-950 text-white py-12 mt-16 text-center">
    <p>&copy; 2024 BeautyMart. All rights reserved.</p>
  </footer>
</template>