import "reflect-metadata";
import CacheService from '../../src/services/cacheService';

describe('cacheService', () => {
    it('get with non existing key returns null', async () => {
        const service = makeCacheService()
        const value = service.get('key')
        expect(value).toBe(null)
    })

    it('get with defined value returns cached value', async () => {
        const service = makeCacheService()
        const key = 'key'
        const value = 'myVal'
        service.put(key, value)
        const cachedValue = service.get(key)
        expect(cachedValue).toEqual(value)
    })

    it('del with defined key removes from cache', async () => {
        const service = makeCacheService()
        const key = 'key'
        const value = 'myVal'
        service.put(key, value)
        service.del(key)
        const cachedValue = service.get(key)
        expect(cachedValue).toBe(null)
    })

    it('clear when called clears the entire cache', async () => {
        const service = makeCacheService()
        const key = 'key'
        const value = 'myVal'
        service.put(key, value)
        service.clear()
        const cachedValue = service.get(key)
        expect(cachedValue).toBe(null)
    })
})

function makeCacheService() { return new CacheService() }