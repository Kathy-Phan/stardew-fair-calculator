const app = Vue.createApp({
    data() {
        return {
            categories: [],
            selectedItems: [],
            profession: 'Base',
            activeTab: 0

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
                    fetch(JSONfile).then(res => res.json())
                );
                const fetchedCategories = await Promise.all(fetchPromises);
                this.categories = fetchedCategories;
            } catch (e) {
                console.log("Could not fetch data: ", e)
                this.categories = [];
            }
        },
        addItem(item, quality, index) {
            if (this.selectedItems.length > 9) {
                alert("Maximum 9 items");
                return;
            }

            const points = item.quality[quality]
            const newItem = {
                name: item.name,
                quality: quality,
                category: this.categories[index].name,
                points: points,
                type: item.type,
                id: Date.now() + Math.random()
            }
            this.selectedItems.push(newItem)
        },
        removeItem(id) {
            this.selectedItems = this.selectedItems.filter(item => item.id !== id)
        },
        clearAll() {
            this.selectedItems = []
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
            return [...new Set(this.selectedItems.map(item => item.category))];
        }
    },
    computed: {
        score() {
            const basePoints = 14;
            // 2x-9 (Where x is the number of items on display).
            const numItemsPoints = (2 * this.selectedItems.length) - 9;
            const uniqueCategoryPoints = this.getUniqueCategories();
            // Each category represented in the display earns 5 points, up to a maximum of 30 points
            const categoryPoints = Math.min(30, (5 * uniqueCategoryPoints.length));
            const itemPoints = this.selectedItems.reduce((sum, item) => sum + item.points, 0);

            return {
                base: basePoints,
                numOfItems: numItemsPoints,
                category: categoryPoints,
                sumItems: itemPoints,
                total: basePoints + numItemsPoints + categoryPoints + itemPoints
            }
        },
        filterItems() {
            if (this.categories.length === 0 || this.activeTab >= this.categories.length) {
                return [];
            }
            const items = this.categories[this.activeTab].items;
            return items.filter(item => {
                return item.type === this.profession;
            });
        }
    }
})

app.mount('#app');