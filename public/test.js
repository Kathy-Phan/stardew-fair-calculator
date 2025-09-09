const { createApp } = Vue;

const app = {
    data() {
        return {
            activeTab: 0,
            selectedItems: [],
            profession: 'Base',
            categories: []
        };
    },
    async mounted() {
        await this.fetchData();
    },
    methods: {
        async fetchData() {
            const fileNames = [
                'items/animal.json',
                'items/artisan.json',
                'items/cooking.json',
                'items/fish.json',
                'items/forage.json',
                'items/fruit.json',
                'items/minerals.json',
                'items/vegetables.json'
            ];

            try {
                // Create an array of promises, one for each fetch request
                const fetchPromises = fileNames.map(fileName =>
                    fetch(fileName).then(response => {
                        if (!response.ok) {
                            throw new Error(`Failed to fetch ${fileName}: ${response.statusText}`);
                        }
                        return response.json();
                    })
                );

                // Wait for all promises to resolve
                const fetchedCategories = await Promise.all(fetchPromises);
                
                // Assign the fetched data to the categories array
                this.categories = fetchedCategories;

            } catch (error) {
                console.error('Error fetching data:', error);
                // Optionally, you can set a fallback here
                this.categories = []; // Set to an empty array or static data
            }
        },
        addItem(categoryIndex, item, quality) {
            // Your addItem logic
            if (this.selectedItems.length >= 9) {
                alert("Maximum 9 items allowed!");
                return;
            }

            const points = item.quality[quality];
            const newItem = {
                name: item.name,
                category: this.categories[categoryIndex].name,
                quality: quality,
                points: points,
                type: item.type,
                id: Date.now() + Math.random()
            };
            this.selectedItems.push(newItem);
        },
        removeItem(id) {
            this.selectedItems = this.selectedItems.filter(item => item.id !== id);
        },
        clearAll() {
            this.selectedItems = [];
        },
        getQualityColor(quality) {
            switch(quality) {
                case 'normal': return 'text-gray-600';
                case 'silver': return 'text-gray-400';
                case 'gold': return 'text-yellow-500';
                case 'iridium': return 'text-purple-500';
                default: return 'text-gray-600';
            }
        },
        getQualityDisplay(quality) {
            switch(quality) {
                case 'normal': return 'Normal';
                case 'silver': return 'Silver';
                case 'gold': return 'Gold';
                case 'iridium': return 'Iridium';
                default: return quality;
            }
        },
        getUniqueCategories() {
            return [...new Set(this.selectedItems.map(item => item.category))];
        }
    },
    computed: {
        score() {
            const basePoints = 14;
            const itemCountPoints = Math.max(0, 9 - 2 * (9 - this.selectedItems.length));
            const uniqueCategories = [...new Set(this.selectedItems.map(item => item.category))];
            const categoryPoints = Math.min(30, uniqueCategories.length * 5);
            const itemPoints = this.selectedItems.reduce((sum, item) => sum + item.points, 0);

            return {
                base: basePoints,
                itemCount: itemCountPoints,
                category: categoryPoints,
                items: itemPoints,
                total: basePoints + itemCountPoints + categoryPoints + itemPoints
            };
        },
        filteredItems() {
            if (this.categories.length === 0 || this.activeTab >= this.categories.length) {
                return []; // Handle case where data isn't loaded or activeTab is out of bounds
            }
            const items = this.categories[this.activeTab].items;
            return items.filter(item => {
                if (item.type === 'Base') return true;
                return item.type === this.profession;
            });
        }
    }
};

createApp(app).mount('#app');