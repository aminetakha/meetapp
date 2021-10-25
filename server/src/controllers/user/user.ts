import { User } from "../../models/User";
import { Filters } from "../../types/Filters";
import { UserInfo } from "../../types/UserInfo";
import { findUserById, findUserByProviderId } from "../auth"
import Stripe from "stripe"

export const changeUserStatus = async (mode: boolean, id: string) => {
    const user = await findUserById(id)
    user.active = mode
    await user.save()
}

export const updateProfileImage = async (providerId, path) => {
    let user = await findUserByProviderId(providerId);
    user.image = path
    user = await user.save()
    return user
}

export const updateUserProfile = async (user: UserInfo) => {
    let currentUser = await findUserByProviderId(user.providerId);
    currentUser.username = user.username;
    currentUser.gender = user.gender;
    currentUser.birthdate = user.date;
    currentUser.country = user.country;
    currentUser.about = user.about;
    currentUser = await currentUser.save();
    return currentUser;
}

export const updateUsernameAndAbout = async (user) => {
    let currentUser = await findUserByProviderId(user.providerId);
    currentUser.username = user.username;
    currentUser.about = user.about;
    currentUser = await currentUser.save();
    return currentUser;
}

export const getActiveUsers = async (filters: Filters) => {
    const {country, gender, status, minAge, maxAge, page, itemsPerPage} = filters;
    const minDate = new Date(`${2021-minAge}-1-1`).toISOString();
    const maxDate = new Date(`${2021-maxAge}-1-1`).toISOString();
    let users;
    if(country && gender){
        users = await User.find(
            {
                active: status, 
                country: country,
                gender: gender,
                birthdate: { $lt: minDate, $gt: maxDate },
            }).skip(page * itemsPerPage).limit(itemsPerPage);
    }else if(!country && !gender){
        users = await User.find(
            {
                active: status,
                birthdate: { $lt: minDate, $gt: maxDate },
            }).skip(page * itemsPerPage).limit(itemsPerPage);
    }else if(country){
        users = await User.find(
            {
                active: status, 
                country: country,
                birthdate: { $lt: minDate, $gt: maxDate },
            }).skip(page * itemsPerPage).limit(itemsPerPage);
    }else if(gender){
        users = await User.find(
            {
                active: status,
                gender: gender, 
                birthdate: { $lt: minDate, $gt: maxDate },
            }).skip(page * itemsPerPage).limit(itemsPerPage);
    }
    return users;
}

export const getOrCreateCustomer = async (userId) => {
    const stripe = new Stripe("sk_test_51HgXS9AM0fYeg1Kd3UInSAKEkdySDyetIdEEpZaRjm14zD2fjX1YXpLInraFXEjkRo8xtAU8JKNdE4gM0gpRCQya00n6UHYx5j", {
        apiVersion: "2020-08-27",
    });
    const user = await findUserById(userId);
    if(!user.stripeCustomerId){
        const customer = await stripe.customers.create({
            metadata: {
                userId: user.id
            }
        })
        user.stripeCustomerId = customer.id
        await user.save();
        return customer;
    }else{
        return await stripe.customers.retrieve(user.stripeCustomerId);
    }
}