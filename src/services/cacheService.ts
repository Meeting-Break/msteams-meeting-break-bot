import { get, put, del, clear } from 'memory-cache'

class CacheService {
    put(key: string, value: any, time?: number) {
        console.trace(`Adding ${key} to cache.`)
        put(key, value, time)
    }

    get(key: string) {
        console.trace(`Retrieving ${key} from cache.`)
        return get(key)
    }

    del(key: string) {
        console.trace(`Removing ${key} from cache.`)
        del(key)
    }

    clear() {
        console.trace("Clearing the cache.")
        clear()
    }
}

export default new CacheService()