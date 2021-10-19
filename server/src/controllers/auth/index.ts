import { User } from "../../models/User"


export const createUser = async (data) => {
    try {
        let user = await findUserByProviderId(data.providerId);
        if(user){
            return user
        }
        user = new User({
            providerId: data.providerId,
            username: data.username,
            pushToken: data.pushToken,
            tokens: 10,
            active: true,
            image: data.image,
            gender: data.gender,
            country: data.country,
            birthdate: data.birthdate,
            about: data.about
        })
       user = await user.save();
       return user;
    } catch (err) {
        console.log(err)
        return {error: err}
    }
}

export const findUserByProviderId = async  providerId => {
    const user = await User.findOne({providerId})
    return user;
} 

export const findUserById = async id => {
    const user = await User.findById(id);
    return user;
}