import { hash as _hash, compare } from 'bcrypt'

const SALT_ROUNDS = 10

export function hashPassword(password) {
    return new Promise((resolve,reject) => {
        _hash(password,SALT_ROUNDS,(err,encrypted) => {
            if(err)
                return reject(err)
                
            resolve(encrypted)
        })
    })
}

export function matchPassword(hash,password) {
    return new Promise((resolve,reject) => {
        compare(password,hash,(err,same) => {
            if(err)
                return reject(err)
            resolve(same)
        })
    })
}

//TESTING
/* async function test() {
    const pass = 'asdf'
    const hash = await hashPassword(pass)
    console.log("HASH:",hash); 
    const match = await matchPassword(hash,'asdf')
    console.log("Password matches:",match);
}

test(); */