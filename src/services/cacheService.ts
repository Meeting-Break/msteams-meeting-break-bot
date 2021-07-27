import { get, put, del, clear } from 'memory-cache'

class CacheService {
    put(key: string, value: any, time?: number) {
        console.debug(`Adding ${key} to cache.`)
        put(key, value, time)
    }

    get(key: string) {
        console.debug(`Retrieving ${key} from cache.`)
        return get(key)
    }

    del(key: string) {
        console.debug(`Removing ${key} from cache.`)
        del(key)
    }

    clear() {
        console.debug("Clearing the cache.")
        clear()
    }
}

export default new CacheService()