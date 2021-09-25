import crypto from 'crypto'

export const parseName = (input: string | undefined) => {
    let fullName = input || "";
    let result = {
        name: '',
        lastName: '',
        secondLastName: '',
    };

    if (fullName.length > 0) {
        let nameTokens = fullName.match(/[A-ZÁ-ÚÑÜ][a-zá-úñü]+|([aeodlsz]+\s+)+[A-ZÁ-ÚÑÜ][a-zá-úñü]+/g) || [];
        if (nameTokens.length > 3) {
            result.name = nameTokens.slice(0, 2).join(' ');
        } else {
            result.name = nameTokens.slice(0, 1).join(' ');
        }

        if (nameTokens.length > 2) {
            result.lastName = nameTokens.slice(-2, -1).join(' ');
            result.secondLastName = nameTokens.slice(-1).join(' ');
        } else {
            result.lastName = nameTokens.slice(-1).join(' ');
            result.secondLastName = "";
        }
    }
    return result;
}

export const encryptPassword = async(password: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        const salt = crypto.randomBytes(32).toString("hex")

        crypto.scrypt(password, salt, 64, (err, derivedKey) => {
            if (err) reject(err);
            resolve(salt + ":" + derivedKey.toString('hex'))
        });
    })
}

export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        const [salt, key] = hash.split(":")
        crypto.scrypt(password, salt, 64, (err, derivedKey) => {
            if (err) reject(err);
            resolve(key == derivedKey.toString('hex'))
        });
    })
}