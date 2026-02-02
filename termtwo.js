const apiKey = "";
        const departments = [
            { id: "shopping", category: "Lifestyle", title: "Best Online Shopping", desc: "Reliable stores for everything.", tags: ["ecommerce", "amazon", "flipkart", "clothes"], items: [{ name: "Amazon India", link: "https://amazon.in", badge: "Fastest" }, { name: "Flipkart", link: "https://flipkart.com", badge: "Tech" }] },
            { id: "tickets", category: "Entertainment", title: "Movie Ticket Booking", desc: "Book movies instantly.", tags: ["cinema", "pvr", "bookmyshow"], items: [{ name: "BookMyShow", link: "https://bookmyshow.com", badge: "Leader" }, { name: "Insider", link: "https://insider.in", badge: "Events" }] },
            { id: "travel", category: "Lifestyle", title: "Best of Travelling", desc: "Plan trips and find stays.", tags: ["travel", "vacation", "flights"], items: [{ name: "MakeMyTrip", link: "https://makemytrip.com", badge: "All-in-One" }, { name: "Booking.com", link: "https://booking.com", badge: "Global" }] },
            { id: "editing", category: "Creative", title: "Best Editing Tools", desc: "Pro photo and video tools.", tags: ["adobe", "capcut", "canva", "edit"], items: [{ name: "Adobe Premiere", link: "https://adobe.com", badge: "Pro Video" }, { name: "CapCut", link: "https://capcut.com", badge: "Socials" }] },
            { id: "laptops", category: "Hardware", title: "Best Laptops (2025)", desc: "Top hardware for every task.", tags: ["mac", "gaming", "dell", "asus"], items: [{ name: "MacBook Air", link: "https://apple.com", badge: "Study" }, { name: "ROG Strix", link: "https://rog.asus.com", badge: "Gaming" }] },
            { id: "ai-img", category: "AI", title: "AI Image Generators", desc: "Create art instantly.", tags: ["art", "dalle", "midjourney"], items: [{ name: "DALL-E 3", link: "https://openai.com", badge: "Easy" }, { name: "Midjourney", link: "https://midjourney.com", badge: "Pro" }] },
            { id: "ai-search", category: "Utilities", title: "AI for Searching", desc: "Answers, not links.", tags: ["perplexity", "search", "ai"], items: [{ name: "Perplexity AI", link: "https://perplexity.ai", badge: "Research" }, { name: "Genspark", link: "https://genspark.ai", badge: "Pages" }] },
            { id: "food", category: "Lifestyle", title: "Food Ordering", desc: "Cravings satisfied.", tags: ["food", "zomato", "swiggy"], items: [{ name: "Zomato", link: "https://zomato.com", badge: "Discovery" }, { name: "Swiggy", link: "https://swiggy.com", badge: "Delivery" }] },
            { id: "learning", category: "Learning", title: "Online Learning", desc: "Access the world's knowledge.", tags: ["study", "coursera", "udemy"], items: [{ name: "Coursera", link: "https://coursera.org", badge: "Degrees" }, { name: "Udemy", link: "https://udemy.com", badge: "Skills" }] }
        ];

        async function callGemini(prompt, isSearch = false) {
            let delay = 1000;
            for (let i = 0; i < 5; i++) {
                try {
                    const body = {
                        contents: [{ parts: [{ text: prompt }] }],
                        systemInstruction: { parts: [{ text: "You are the Curato AI Assistant. Your job is to help users find the best tools from our directory. Be concise, professional, and friendly. Always refer to tools available in our list if relevant." }] }
                    };
                    if (isSearch) body.tools = [{ "google_search": {} }];

                    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(body)
                    });
                    
                    if (!response.ok) throw new Error('API Error');
                    const data = await response.json();
                    return data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't generate a response.";
                } catch (e) {
                    if (i === 4) return "Connection failed after multiple retries. Please try again later.";
                    await new Promise(r => setTimeout(r, delay));
                    delay *= 2;
                }
            }
        }

        async function getSmartAdvice() {
            const query = document.getElementById('searchBar').value || "the top apps available";
            const adviceBox = document.getElementById('ai-advice-container');
            const content = document.getElementById('ai-advice-content');
            
            adviceBox.classList.remove('hidden');
            content.innerHTML = `<div class="flex items-center gap-2 text-indigo-400">
                <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Thinking... analyzing 2025 trends...
            </div>`;

            const prompt = `A user is searching for: "${query}". Based on this list of departments in our app: ${JSON.stringify(departments)}, explain which 2 or 3 specific apps/hardware would be best for them and why. Use bullet points. Keep it under 100 words.`;
            const result = await callGemini(prompt, true);
            content.innerText = result;
        }

        async function buildStack() {
            const goal = document.getElementById('goalInput').value;
            if (!goal) return;
            
            const btn = document.getElementById('buildBtn');
            const resultDiv = document.getElementById('stack-result');
            const oldText = btn.innerHTML;
            
            btn.disabled = true;
            btn.innerHTML = `✨ Building...`;
            resultDiv.classList.remove('hidden');
            resultDiv.innerHTML = `<div class="py-10 text-slate-400 italic">Consulting AI experts to build your stack...</div>`;

            const prompt = `The user's goal is: "${goal}". Look at our directory categories: ${JSON.stringify(departments)}. Create a "Success Stack" plan. Recommend 3 specific items from our list and 1 other top tool from the web. Format: "Step 1: [Name] - [Reasoning]". Finally, give a 1-sentence motivational tip. Use markdown.`;
            
            const response = await callGemini(prompt, true);
            resultDiv.innerHTML = `<div class="prose prose-blue mt-6 p-6 bg-blue-50 rounded-2xl border border-blue-100">${response.replace(/\n/g, '<br>')}</div>`;
            btn.disabled = false;
            btn.innerHTML = oldText;
        }

        function closeAdvice() { document.getElementById('ai-advice-container').classList.add('hidden'); }

        const grid = document.getElementById('card-grid');
        const searchInput = document.getElementById('searchBar');
        const noResults = document.getElementById('no-results');

        function render(filter = "") {
            grid.innerHTML = "";
            const query = filter.toLowerCase().trim();
            const filtered = departments.filter(d => d.title.toLowerCase().includes(query) || d.category.toLowerCase().includes(query) || d.tags.some(t => t.toLowerCase().includes(query)));

            if (filtered.length === 0) noResults.classList.remove('hidden');
            else {
                noResults.classList.add('hidden');
                filtered.forEach(dept => {
                    const card = document.createElement('div');
                    card.className = "bg-white p-6 rounded-2xl border border-slate-100 card-hover flex flex-col h-full shadow-sm";
                    card.innerHTML = `
                        <div class="mb-4">
                            <span class="text-xs font-bold uppercase tracking-wider text-blue-500 bg-blue-50 px-2 py-1 rounded">${dept.category}</span>
                            <h3 class="text-xl font-bold mt-2 text-slate-800">${dept.title}</h3>
                            <p class="text-slate-500 text-sm mt-1">${dept.desc}</p>
                        </div>
                        <div class="space-y-3 flex-grow">${dept.items.map(item => `
                            <a href="${item.link}" target="_blank" class="group flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                                <div class="flex flex-col">
                                    <span class="font-medium text-sm">${item.name}</span>
                                    <span class="text-[10px] text-slate-400 group-hover:text-blue-100 uppercase font-bold tracking-tight">${item.badge}</span>
                                </div>
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                            </a>`).join('')}
                        </div>`;
                    grid.appendChild(card);
                });
            }
        }

        searchInput.addEventListener('input', (e) => render(e.target.value));
        window.onload = () => render();