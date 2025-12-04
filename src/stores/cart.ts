import { defineStore } from "pinia";
import {ref, computed} from 'vue'

export interface CartItem {
    id: number
    name: string
    price: number
    image: string
    rating: number
    stock: number
    description: string
    quantity: number
}

export const useCartStore= defineStore('cart', ()=> {
    const items= ref<CartItem[]>([])

    const totalItems= computed(()=> 
        items.value.reduce((total, item)=> total + item.quantity, 0)
    )
    const subTotal= computed(()=> 
        items.value.reduce((total, item)=> total + (item.price * item.quantity), 0)
    )
    const isInCart= (productId: number)=> 
        items.value.some(item => item.id === productId)
    const getQuantity= (productId: number)=> 
        items.value.find(item => item.id === productId)?.quantity || 0

    const addToCart= (product: Omit<CartItem, 'quantity'>)=> {
        const existingItem= items.value.find(item => item.id === product.id)
        if(existingItem){
            if(existingItem.quantity < product.stock){
                existingItem.quantity += 1
            }
        } else{
            items.value.push({...product, quantity: 1})
        }
    }
    const updateQuantity= (productId: number, change: number)=> {
        const item= items.value.find(item => item.id === productId)
        if (item){
            const newQuantity= item.quantity + change
            if(newQuantity >= 1 && newQuantity <= item.stock){
                item.quantity = newQuantity
            }
        }
    }
    const removeFromCart= (productId: number)=> {
        const index= items.value.findIndex(item => item.id === productId)
        if(index !== -1){
            items.value.splice(index, 1)
        }
    }
    const clearCart= ()=> {
        items.value= []
    }
    const checkout= ()=> {
        const message= `Thank you for your purchase! Your order total is $${subTotal.value.toFixed(2)}. Your items will be shipped within 3-5 business days.`
        clearCart()
        return message
    }

    return {
        items,
        totalItems,
        subTotal,
        isInCart,
        getQuantity,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        checkout
    }
})