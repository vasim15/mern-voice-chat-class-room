const crypto = require('crypto')
const hashedService = require('./hash-service')

class OptService{
    async generateOtp () {
        return crypto.randomInt(1000, 9999)
    }
    async verifyOtp (hashed, data) {
        const computeHash = hashedService.hashOtp(data);
        return computeHash === hashed;
    }
}

module.exports = new OptService();