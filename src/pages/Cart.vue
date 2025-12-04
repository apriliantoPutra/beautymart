<script setup lang="ts">
import { ShoppingCart, Home, Package, Trash2, Plus, Minus, CreditCard, Shield, Truck, Star } from 'lucide-vue-next'
import { computed, ref } from 'vue'
import { useCartStore } from '../stores/cart'

const cartStore = useCartStore()
const checkoutMessage = ref<string>('')

// Format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount)
}

// Update quantity
const updateQuantity = (productId: number, change: number) => {
  cartStore.updateQuantity(productId, change)
}

// Remove item
const removeItem = (productId: number) => {
  cartStore.removeFromCart(productId)
}

// Checkout handler
const handleCheckout = () => {
  if (cartStore.items.length > 0) {
    const message = cartStore.checkout()
    checkoutMessage.value = message
    // Show message for 5 seconds
    setTimeout(() => {
      checkoutMessage.value = ''
    }, 5000)
  }
}

// Shipping fee
const shippingFee = computed(() => {
  return cartStore.subTotal >= 100 ? 0 : 2.99
})

const total = computed(() => cartStore.subTotal + shippingFee.value)
</script>

<template>
  <header class="sticky top-0 z-50 bg-gradient-to-r from-purple-700 to-purple-900 text-white px-6 py-4 shadow-xl">
    <div class="container mx-auto flex justify-between items-center">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-white rounded-full flex items-center justify-center">
          <span class="text-purple-800 font-bold text-xl">B</span>
        </div>
        <h1 class="text-2xl font-bold tracking-wider">BeautyMart</h1>
      </div>

      <div class="relative group">
        <div class="flex items-center gap-2 bg-purple-800 hover:bg-purple-700 px-4 py-2 rounded-xl transition-all">
          <ShoppingCart class="w-6 h-6" />
          <span class="font-medium">Cart</span>
          <span
            class="absolute -top-2 -right-2 bg-yellow-400 text-purple-900 font-bold text-xs rounded-full w-6 h-6 flex items-center justify-center">
            {{ cartStore.totalItems }}
          </span>
        </div>
      </div>
    </div>
  </header>

  <main class="container mx-auto px-4 py-8 min-h-screen">
    <!-- Checkout Message -->
    <div v-if="checkoutMessage" 
         class="mb-6 bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-xl">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <span class="text-green-600 font-bold">✓</span>
          </div>
          <p class="font-medium">{{ checkoutMessage }}</p>
        </div>
        <button @click="checkoutMessage = ''" class="text-green-600 hover:text-green-800">
          ×
        </button>
      </div>
    </div>

    <!-- Breadcrumb -->
    <div class="flex items-center gap-2 text-gray-600 mb-8">
      <router-link to="/" class="hover:text-purple-600 transition-colors flex items-center gap-1">
        <Home class="w-4 h-4" />
        Home
      </router-link>
      <span>/</span>
      <router-link to="/cart" class="text-purple-600 font-medium">Shopping Cart</router-link>
    </div>

    <!-- Cart Header -->
    <div class="mb-8">
      <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Your Shopping Cart</h1>
      <p class="text-gray-600" v-if="cartStore.items.length > 0">
        You have {{ cartStore.items.length }} item{{ cartStore.items.length !== 1 ? 's' : '' }} in your cart
      </p>
      <p class="text-gray-600" v-else>
        Your cart is empty
      </p>
    </div>

    <!-- Empty State -->
    <div v-if="cartStore.items.length === 0" 
         class="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
      <div class="w-24 h-24 mx-auto mb-6 bg-purple-100 rounded-full flex items-center justify-center">
        <ShoppingCart class="w-12 h-12 text-purple-600" />
      </div>
      <h2 class="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
      <p class="text-gray-600 mb-8 max-w-md mx-auto">
        Looks like you haven't added any beauty products to your cart yet.
      </p>
      <router-link to="/"
                   class="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
        <Package class="w-5 h-5" />
        Browse Products
      </router-link>
    </div>

    <!-- Cart Content -->
    <div v-else class="flex flex-col lg:flex-row gap-8">
      <div class="lg:w-2/3">
        <div class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div class="divide-y divide-gray-100">
            <div v-for="item in cartStore.items" :key="item.id" class="p-6">
              <div class="flex flex-col md:flex-row gap-6">
                <!-- Product Image -->
                <div class="md:w-32 md:h-32 w-full h-48 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                  <img :src="item.image" :alt="item.name" class="w-full h-full object-cover">
                </div>

                <!-- Product Info -->
                <div class="flex-1 flex flex-col">
                  <div class="flex justify-between items-start mb-4">
                    <div class="flex-1">
                      <h3 class="text-xl font-bold text-gray-900 hover:text-purple-600 transition-colors cursor-pointer">
                        {{ item.name }}
                      </h3>
                      <p class="text-gray-500 text-sm mt-1">{{ item.description }}</p>
                      
                      <!-- Rating & Stock -->
                      <div class="flex items-center gap-4 mt-3">
                        <!-- Rating -->
                        <div class="flex items-center gap-2">
                          <div class="flex">
                            <Star v-for="n in 5" :key="n" 
                                  class="w-4 h-4"
                                  :class="n <= item.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'" />
                          </div>
                          <span class="text-gray-600 text-sm">{{ item.rating.toFixed(1) }}</span>
                        </div>
                        
                        <!-- Stock Indicator -->
                        <div class="flex items-center gap-2">
                          <div :class="[
                            'w-2 h-2 rounded-full',
                            item.stock > 5 ? 'bg-green-500' : 
                            item.stock > 0 ? 'bg-yellow-500' : 'bg-red-500'
                          ]"></div>
                          <span class="text-gray-600 text-sm">
                            {{ item.stock > 0 ? `${item.stock} in stock` : 'Out of stock' }}
                          </span>
                        </div>
                      </div>
                    </div>

                    <!-- Mobile Price -->
                    <div class="md:hidden">
                      <p class="text-2xl font-bold text-purple-700">{{ formatCurrency(item.price * item.quantity) }}</p>
                    </div>
                  </div>

                  <div class="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                    <!-- Desktop Price -->
                    <div class="hidden md:block">
                      <p class="text-2xl font-bold text-purple-700">{{ formatCurrency(item.price) }}</p>
                    </div>

                    <!-- Quantity Controls -->
                    <div class="flex items-center gap-4">
                      <div class="flex items-center gap-3 bg-gray-50 rounded-lg px-3 py-2">
                        <button 
                          @click="updateQuantity(item.id, -1)"
                          :disabled="item.quantity <= 1"
                          class="w-6 h-6 rounded-full flex items-center justify-center hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <Minus class="w-4 h-4 text-gray-600" />
                        </button>
                        <span class="text-lg font-semibold w-8 text-center">{{ item.quantity }}</span>
                        <button 
                          @click="updateQuantity(item.id, 1)"
                          :disabled="item.quantity >= item.stock"
                          class="w-6 h-6 rounded-full flex items-center justify-center hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <Plus class="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                      
                      <!-- Desktop Total -->
                      <div class="hidden md:block">
                        <p class="text-xl font-bold text-gray-900">{{ formatCurrency(item.price * item.quantity) }}</p>
                      </div>
                    </div>

                    <!-- Actions -->
                    <div class="flex items-center gap-2">
                      <button 
                        @click="removeItem(item.id)"
                        class="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
                        title="Remove Item"
                      >
                        <Trash2 class="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  
                  <!-- Mobile Total -->
                  <div class="md:hidden flex justify-between items-center mt-4">
                    <span class="text-gray-600">Total:</span>
                    <p class="text-xl font-bold text-purple-700">{{ formatCurrency(item.price * item.quantity) }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Cart Footer -->
          <div class="p-6 bg-gray-50 border-t border-gray-200">
            <div class="flex items-center gap-4">
              <span class="text-gray-600">Subtotal:</span>
              <span class="text-2xl font-bold text-purple-700">{{ formatCurrency(cartStore.subTotal) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Order Summary -->
      <div class="lg:w-1/3">
        <div class="sticky top-24 space-y-6">
          <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h2 class="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
            
            <div class="space-y-4 mb-6">
              <div class="flex justify-between text-gray-600">
                <span>Subtotal ({{ cartStore.totalItems }} items)</span>
                <span class="font-medium">{{ formatCurrency(cartStore.subTotal) }}</span>
              </div>
              
              <div class="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span :class="shippingFee === 0 ? 'text-green-600' : ''" class="font-medium">
                  {{ shippingFee === 0 ? 'FREE' : formatCurrency(shippingFee) }}
                </span>
              </div>
              
              <div class="border-t border-gray-200 pt-4">
                <div class="flex justify-between text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span class="text-2xl text-purple-700">{{ formatCurrency(total) }}</span>
                </div>
                <p class="text-sm text-gray-500 mt-1">Tax included</p>
                <p v-if="cartStore.subTotal < 50" class="text-sm text-purple-600 mt-1">
                  Add ${{ (100 - cartStore.subTotal).toFixed(2) }} more for free shipping
                </p>
              </div>
            </div>

            <button 
              @click="handleCheckout"
              class="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 mb-4"
            >
              Proceed to Checkout
            </button>
          </div>

          <!-- Benefits Card -->
          <div class="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-100 p-6">
            <h3 class="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span class="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                <Star class="w-4 h-4 text-purple-600" />
              </span>
              Shopping Benefits
            </h3>
            
            <div class="space-y-4">
              <div class="flex items-start gap-3">
                <Truck class="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p class="font-medium text-gray-900">Free Shipping</p>
                  <p class="text-sm text-gray-600">On orders over $50</p>
                </div>
              </div>
              
              <div class="flex items-start gap-3">
                <CreditCard class="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p class="font-medium text-gray-900">Easy Returns</p>
                  <p class="text-sm text-gray-600">30-day return policy</p>
                </div>
              </div>
              
              <div class="flex items-start gap-3">
                <Shield class="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p class="font-medium text-gray-900">100% Secure</p>
                  <p class="text-sm text-gray-600">Protected payment</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
  <footer class="bg-gradient-to-r from-purple-900 to-purple-950 text-white py-12 mt-16 text-center">
    <p>&copy; 2024 BeautyMart. All rights reserved.</p>
  </footer>
</template>