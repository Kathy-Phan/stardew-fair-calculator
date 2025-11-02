const app = Vue.createApp({
    data() {
        return {
            categories: [],
            uniqueItems: [],
            profession: 'Base',
            activeTab: 0,
            searchTerm: ''
        }
    },
    async mounted() {
        await this.fetchData();
    },
    methods: {
        async fetchData() {
            const data = [
                'items/animal.json',
                'items/artisan.json',
                'items/cooking.json',
                'items/fish.json',
                'items/forage.json',
                'items/fruit.json',
                'items/minerals.json',
                'items/vegetables.json'
            ];
            // fetch all JSON files and store in this.categories
            try {
                const fetchPromises = data.map(JSONfile =>
                    fetch(JSONfile)
                        .then(res => res.json())
                        .then(category => {
                            category.items = category.items.map(item => ({
                                ...item,
                                type: item.type || 'Base'
                            }));
                            return category;
                        })
                );
        
                const fetchedCategories = await Promise.all(fetchPromises);
                const allItems = fetchedCategories.flatMap(c => c.items);
        
                this.categories = [
                    { category: 'All', items: allItems },
                    ...fetchedCategories
                ];
            } catch (e) {
                console.log("Could not fetch data: ", e)
                this.categories = [];
            }
        },
        addItem(item, quality, category) {
            if (this.uniqueItems.reduce((sum, item) => item.quantity + sum, 1) > 9) {
                return;
            }
            const exists = this.uniqueItems.find(
                i => i.name === item.name && i.quality === quality && i.type === item.type
            );

            if (exists) {
                exists.quantity++;
            } else {
                const points = item.quality[quality]
                const newItem = {
                    name: item.name,
                    quality: quality,
                    image: item.image,
                    category: category.category,
                    points: points,
                    type: item.type,
                    id: Date.now() + Math.random(),
                    quantity: 1
                }
                this.uniqueItems.push(newItem)
            }
        },
        removeItem(id) {
            this.uniqueItems = this.uniqueItems.filter(item => item.id !== id)
        },
        incrementItem(item) {
            if (this.uniqueItems.reduce((sum, item) => sum + item.quantity, 1) > 9) {
                return;
            }
            
            let exists = this.uniqueItems.find(
                i => i.name === item.name && i.quality === item.quality
            )

            if (exists) {
                exists.quantity++;
            }
        },
        decrementItem(id) {
            const item = this.uniqueItems.find(i => i.id == id);

            if (item.quantity > 1) {
                item.quantity--;
            } else {
                this.removeItem(id)
            }
        },
        clearAll() {
            this.uniqueItems = []
        },
        getQualityName(quality) {
            switch(quality) {
                case 'normal': return 'Normal';
                case 'silver': return 'Silver';
                case 'gold': return 'Gold';
                case 'iridium': return 'Iridium';
                default: return quality;
            }
        },
        getQualityColour(quality) {
            switch(quality) {
                case 'normal': return 'text-gray-600';
                case 'silver': return 'text-gray-400';
                case 'gold': return 'text-yellow-500';
                case 'iridium': return 'text-purple-500';
                default: return 'text-gray-600';
            }
        },
        getUniqueCategories() {
            return [...new Set(this.uniqueItems.map(item => item.category))];
        },
        getOverlayImage(name) {
            let key = '';

            if (name.includes('Aged Roe')) key = 'Aged_Roe';
            else if (name.includes('Dried Fruit')) key = 'Dried_Fruit';
            else if (name.includes('Honey') && name !== 'Honey (Wild)') key = 'Honey';
            else if (name.includes('Jelly') && name !== 'Jelly') key = 'Jelly';
            else if (name.includes('Wine') && name !== 'Wine') key = 'Wine';
            else if (name.includes('Juice') && name !== 'Juice') key = 'Juice';
            else if (name.includes('Pickles') && name !== 'Pickles') key = 'Pickles';
            else return '';

            switch(key) {
                case 'Aged_Roe': return 'images/artisanGoods/Aged_Roe_Overlay.png';
                case 'Dried_Fruit': return 'images/artisanGoods/Dried_Fruit_Overlay.png';
                case 'Honey': return 'images/artisanGoods/Honey_Overlay.png';
                case 'Jelly': return 'images/artisanGoods/Jelly_Overlay.png';
                case 'Wine': return 'images/artisanGoods/Wine_Overlay.png';
                case 'Juice': return 'images/artisanGoods/Juice_Overlay.png';
                case 'Pickles': return 'images/artisanGoods/Pickles_Overlay.png';
                default: return '';
            }
        }
    },
    computed: {
        score() {
            const basePoints = 14;
            // 2x-9 (Where x is the number of items on display).
            const numItemsPoints = (2 * this.uniqueItems.reduce((sum, item) => sum + item.quantity, 0)) - 9;
            const uniqueCategoryPoints = this.getUniqueCategories();
            // Each category represented in the display earns 5 points, up to a maximum of 30 points
            const categoryPoints = Math.min(30, (5 * uniqueCategoryPoints.length));
            const itemPoints = this.uniqueItems.reduce((sum, item) => sum + (item.points * item.quantity), 0);

            return {
                base: basePoints,
                numOfItems: numItemsPoints,
                category: categoryPoints,
                sumItems: itemPoints,
                total: basePoints + numItemsPoints + itemPoints + categoryPoints
            }
        },
        filterItems() {
            if (this.categories.length === 0 || this.activeTab >= this.categories.length) {
                return [];
            }
            const items = this.categories[this.activeTab].items;
            return items.filter(item => {
                const matchProf = item.type === this.profession;
                const matchSearch = item.name.toLowerCase().includes(this.searchTerm.toLowerCase());
                return matchProf && matchSearch;
            });
        }
    }
})

app.mount('#app');