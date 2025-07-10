// DOM要素のキャッシュ
let appContainer, screen1, screen2, screen3, screen4,
    subjectNameInput, subjectAgeInput, subjectEmailInput, goToScreen2Btn, startExperimentBtn,
    canvasContainer, clusterCanvas, ctx,
    finishPlacementBtn, goToFeedbackBtn, saveFeedbackAndDataBtn,
    loadingSpinner, statusMessage, detailsPanel,
    // 戻るボタン用の変数を追加
    backToScreen1Btn, backToScreen2Btn, backToStartBtn;

// グローバル変数
let subjectInfo = {};
let experimentData = {
    subjectInfo: {}, positions: [], clusters: [],
    placementTime: null, moveHistory: [], relations: []
};
let currentMode = 'intro';
let foodContainers = {};
let isDrawingCluster = false;
let currentDrawingCluster = null;
let activeDeleteButton = null;
let selectedClusterIndexForDeletion = -1;

// 食品リスト
let foodList = [
    { name: "gyoza", label: "餃子", imgSrc: "https://frozenfoodpress.com/wp-content/uploads/2018/06/4c913c8dc502ecd4682d9b2ce0ee6e9f-e1529890604890.jpeg", info: "油・水なしで、誰が調理しても簡単にパリッパリの羽根ができる、うす皮パリッと、ジューシーで具がギュッと詰まった焼き餃子です。\n誰もが好きな、間違いない安定感のある王道のおいしさです。\n国産のお肉と野菜を使用しています。\n【内容量】12個入り（276g）" },
    { name: "chahan", label: "チャーハン", imgSrc: "https://www.ffa.ajinomoto.com/_var/images/products/97/65cae64b3ce70.png?resize=1200x630", info: "焦がしにんにくのマー油と葱油の香ばしさや、噛むほどに広がる焼豚のうま味で、一度口にすると一心不乱に食べきってしまいたくなるチャーハンです。\n焦がしにんにくの香りを引き立たせ、焼豚の風味も調整し、メリハリのある味を実現。\nどんどん食べ進めたくなる味に進化しました。\n【内容量】580g" },
    { name: "empanada", label: "エンパナーダ", imgSrc: "https://static.minne.com/productimages/163758633/w1600xh1600/c65198c3cdad7a2ecc0daf8b67b6f75248355625.JPG?1670218943", info: "エンパナーダとは？\n南米で誰もが知るミートパイ？（アルゼンチンではおにぎり的存在）。\nパイ生地にお好みの具材を包んでオーブンで焼いた最高に美味しい食べ物です。\nこちらは皮が生の状態のエンパナーダを冷凍して真空パックしたものになります。\nお好きな時にお好きな調理方法で焼いてから召し上がってください；）"},
    { name: "gratin", label: "グラタン", imgSrc: "https://img.kurashiru.com/2023/10/30/b0196034-a200-4354-9280-ed4783e2960e.jpeg?width=700&height=700&quality=80&format=jpeg", info: "オーブンで焼くと香ばしい、冬に人気の洋風料理。\nクリーミーなベシャメルソースとチーズが特徴です。" },
    { name: "lasagna", label: "ラザニア", imgSrc: "https://cdn.shopify.com/s/files/1/0075/8993/8611/products/LasagnaforWeb_clipped_rev_1.png?v=1659560198", info: "パスタとミートソース、ホワイトソース、チーズを何層にも重ねて焼き上げたイタリア料理。\nボリューム満点の一品です。" },
    { name: "australian_meatpie", label: "オーストラリアンミートパイ", imgSrc: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/A_meat_pie_in_Australia.jpg/1200px-A_meat_pie_in_Australia.jpg", info: "オーストラリアの代表的な軽食または国民食とも言われる。\nサクサクのパイ生地の中に、ひき肉を主とした具がたっぷり詰まっています。" },
    { name: "ravioli", label: "ラビオリ", imgSrc: "https://www.eatwell101.com/wp-content/uploads/2022/02/mushroom-ravioli-recipe.jpg", info: "小麦粉を練って作ったパスタ生地の間に、ひき肉や野菜、チーズなどの具材を詰めたイタリア料理。\n様々なソースと組み合わせて楽しまれます。" },
    { name: "yakionigiri", label: "焼きおにぎり", imgSrc: "https://www.nichireifoods.co.jp/brand/honkaku_omusubi/images/main.jpg", info: "醤油や味噌などの調味料を塗ったおにぎりを香ばしく焼き上げたもの。\n冷凍食品としても人気で、手軽な夜食やおやつになります。" },
    { name: "reitou_udon", label: "冷凍うどん", imgSrc: "https://www.tablemark.co.jp/vpack/images/L000001328.png", info: "茹でたてのコシと風味をそのまま冷凍したうどん。\n電子レンジや鍋で簡単に調理でき、様々なアレンジが可能です。" },
    { name: "reitou_pasta", label: "冷凍パスタ", imgSrc: "https://www.nisshin-seifun-welna.com/index/noodle/frozen/images/mv_img_01.jpg", info: "レストランのような本格的なパスタが家庭で手軽に楽しめる冷凍食品。\nソースとパスタが一体型になっているものが多いです。" },
    { name: "fried_potato", label: "フライドポテト", imgSrc: "https://res.cloudinary.com/hsxfx8igq/image/upload/t_16x9_recipe_image,f_auto,q_auto/v1638832067/McCain_Fry_Shot_8_Original_zmaxmf.jpg", info: "じゃがいもを細長く切って油で揚げた、世界中で人気のスナック。\n冷凍品を家庭で揚げるだけで、カリッとした食感が楽しめます。" },
    { name: "karaage", label: "鶏のから揚げ", imgSrc: "https://www.ajinomoto.co.jp/recipe/card/707000/images/707421_basic.jpg", info: "鶏肉に下味をつけ、衣をまぶして油で揚げた日本の代表的な料理。\nお弁当のおかずや食卓の一品として、また冷凍食品としても非常に人気があります。" }
];

function getCurrentTimestamp() {
    if (!experimentData.startTime) return 0;
    return Math.floor((Date.now() - experimentData.startTime) / 1000);
}

function loadFoodListFromLocalStorage() {
    console.log("[DEBUG] loadFoodListFromLocalStorage: Attempting to load.");
    try {
        const storedFoodList = localStorage.getItem('foodList');
        if (storedFoodList) {
            const parsedList = JSON.parse(storedFoodList);
            if (Array.isArray(parsedList) && parsedList.length > 0) {
                foodList = parsedList;
                console.log("[DEBUG] loadFoodListFromLocalStorage: Successfully loaded from LS.");
            }
        } else {
            console.log("[DEBUG] loadFoodListFromLocalStorage: No data in LS.");
        }
    } catch (e) {
        console.error("[ERROR] loadFoodListFromLocalStorage: Failed to parse from LS.", e);
    }
}

function saveFoodListToLocalStorage() {
    try {
        localStorage.setItem('foodList', JSON.stringify(foodList));
        console.log("[DEBUG] saveFoodListToLocalStorage: Successfully saved to LS.");
    } catch (e) {
        console.error("[ERROR] saveFoodListToLocalStorage: Failed to save to LS.", e);
    }
}

function showScreen(screenToShow) {
    if (!appContainer || !screenToShow) {
        console.error(`[CRITICAL_ERROR] showScreen: appContainer or screenToShow is null/undefined. appContainer: ${!!appContainer}, screenToShow ID: ${screenToShow?.id}`);
        return;
    }
    const screens = [screen1, screen2, screen3, screen4];
    screens.forEach(s => {
        if(s) s.classList.remove('active');
    });
    screenToShow.classList.add('active');
    if (!appContainer.classList.contains('active')) { // Avoid redundant logs if already active
      appContainer.classList.add('active');
    }
    console.log(`[DEBUG] showScreen: Switched to ${screenToShow.id}. appContainer active: ${appContainer.classList.contains('active')}`);
}

function displayFoodDetails(food) {
    const currentDetailsFoodName = document.getElementById('details-food-name');
    const currentDetailsFoodImage = document.getElementById('details-food-image');
    const currentDetailsFoodInfo = document.getElementById('details-food-info');
    const currentDetailsPlaceholder = document.getElementById('details-placeholder');

    if (!detailsPanel || !currentDetailsFoodName || !currentDetailsFoodImage || !currentDetailsFoodInfo || !currentDetailsPlaceholder) {
         console.warn("[WARN] displayFoodDetails: One or more details panel elements not found.");
         return;
    }
    if (currentMode === 'clusterFeedback' && detailsPanel.querySelector('.cluster-feedback-item')) {
      return;
    }
    if (!food) {
        currentDetailsFoodName.textContent = '';
        currentDetailsFoodImage.src = ''; currentDetailsFoodImage.alt = '食品画像';
        currentDetailsFoodImage.style.display = 'none';
        currentDetailsFoodInfo.innerHTML = '';
        currentDetailsPlaceholder.textContent = '食品の[i]ボタンをクリックすると、ここに詳細情報が表示されます。'; // Ensure placeholder text is set
        currentDetailsPlaceholder.style.display = 'block';
        detailsPanel.scrollTop = 0;
        Object.values(foodContainers).forEach(fc => fc.classList.remove('selected-food-item'));
        return;
    }
    currentDetailsFoodName.textContent = food.label;
    currentDetailsFoodImage.src = food.imgSrc; currentDetailsFoodImage.alt = food.label;
    currentDetailsFoodImage.style.display = 'block';
    currentDetailsFoodInfo.innerHTML = food.info ? food.info.replace(/\n/g, '<br>') : '情報なし';
    currentDetailsPlaceholder.style.display = 'none';
    detailsPanel.scrollTop = 0;
    Object.values(foodContainers).forEach(fc => fc.classList.remove('selected-food-item'));
    if (foodContainers[food.name]) foodContainers[food.name].classList.add('selected-food-item');
}

function resetScreen3UI() {
    console.log("[DEBUG] resetScreen3UI: Resetting Screen 3 UI and partial state.");
    if (canvasContainer) {
        canvasContainer.querySelectorAll('.food-container').forEach(fc => fc.remove());
    }
    if (ctx && clusterCanvas) {
        ctx.clearRect(0, 0, clusterCanvas.width, clusterCanvas.height);
    }
    foodContainers = {};
    experimentData.clusters = []; // Clear only drawn clusters on screen3; full reset in initializeExperiment
    drawAllClusters();

    if (detailsPanel) {
        detailsPanel.innerHTML = `
            <h3 id="details-food-name"></h3>
            <img id="details-food-image" src="" alt="選択された食品の画像" style="display:none;">
            <div id="details-food-info"></div>
            <p id="details-placeholder" class="info-text" style="display:block;">食品の[i]ボタンをクリックすると、ここに詳細情報が表示されます。</p>
        `;
    }
    if (statusMessage) updateStatusMessage("");

    if (finishPlacementBtn) finishPlacementBtn.style.display = 'none';
    if (goToFeedbackBtn) goToFeedbackBtn.style.display = 'none';
    if (saveFeedbackAndDataBtn) saveFeedbackAndDataBtn.style.display = 'none';
    if (clusterCanvas) clusterCanvas.classList.remove('active-drawing');

    removeActiveDeleteButton();
    isDrawingCluster = false;
    currentDrawingCluster = null;
}


function initializeApp() {
    console.log("[DEBUG] initializeApp: Starting application initialization.");
    appContainer = document.getElementById('app');
    screen1 = document.getElementById('screen1');
    screen2 = document.getElementById('screen2');
    screen3 = document.getElementById('screen3');
    screen4 = document.getElementById('screen4');
    subjectNameInput = document.getElementById('subjectName');
    subjectAgeInput = document.getElementById('subjectAge');
    subjectEmailInput = document.getElementById('subjectEmail');
    goToScreen2Btn = document.getElementById('goToScreen2Btn');
    startExperimentBtn = document.getElementById('startExperimentBtn');
    canvasContainer = document.getElementById('canvas-container');
    clusterCanvas = document.getElementById('clusterCanvas');
    ctx = clusterCanvas ? clusterCanvas.getContext('2d') : null;
    finishPlacementBtn = document.getElementById('finishPlacementBtn');
    goToFeedbackBtn = document.getElementById('goToFeedbackBtn');
    saveFeedbackAndDataBtn = document.getElementById('saveFeedbackAndDataBtn');
    loadingSpinner = document.getElementById('loadingSpinner');
    statusMessage = document.getElementById('statusMessage');
    detailsPanel = document.getElementById('details-panel');

    backToScreen1Btn = document.getElementById('backToScreen1Btn');
    backToScreen2Btn = document.getElementById('backToScreen2Btn');
    backToStartBtn = document.getElementById('backToStartBtn');

    const criticalElements = {
        appContainer, screen1, screen2, screen3, screen4,
        subjectNameInput, subjectAgeInput, subjectEmailInput,
        goToScreen2Btn, startExperimentBtn,
        finishPlacementBtn, goToFeedbackBtn, saveFeedbackAndDataBtn,
        canvasContainer, clusterCanvas, detailsPanel,
        loadingSpinner, statusMessage
    };
    let allCriticalFound = true;
    for (const key in criticalElements) {
        if (!criticalElements[key] && criticalElements.hasOwnProperty(key)) {
            console.error(`[CRITICAL_DOM_ERROR] initializeApp: Essential DOM element "${key}" not found! Check HTML.`);
            allCriticalFound = false;
        }
    }
    if (!allCriticalFound) {
        alert("ページ読み込みエラー: 必須要素が見つかりません。(詳細はコンソールを確認)");
        return;
    }
    if (!ctx && clusterCanvas) console.warn("[WARN] initializeApp: Canvas context (ctx) is null.");

    if (goToScreen2Btn) {
        goToScreen2Btn.addEventListener('click', () => {
            const name = subjectNameInput.value.trim();
            const ageString = subjectAgeInput.value.trim();
            const email = subjectEmailInput.value.trim();
            if (!name || !ageString || !email) { alert("全ての項目を入力してください。"); return; }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { alert("有効なメールアドレスを入力してください。"); return; }
            const ageNum = parseInt(ageString, 10);
            if (isNaN(ageNum) || ageNum < 18 || ageNum > 99) { alert("年齢は18歳から99歳の間で、有効な数値を入力してください。"); return; }
            experimentData.subjectInfo = { name, age: ageNum, email };
            if (screen2) { showScreen(screen2); currentMode = 'instructions'; }
            else { console.error("CRITICAL_ERROR: screen2 not found!"); alert("画面遷移エラー(S2)。"); }
        });
    }

    if (startExperimentBtn) {
        startExperimentBtn.addEventListener('click', () => {
            if (!screen3) { console.error("CRITICAL_ERROR: screen3 not found!"); alert("画面遷移エラー(S3)。"); return; }
            showScreen(screen3);
            currentMode = 'placement';
            try { initializeExperiment(); }
            catch (e) { console.error('[CRITICAL_ERROR] Error in initializeExperiment:', e); alert("実験初期化エラー。"); }
        });
    }

    if (finishPlacementBtn) {
        finishPlacementBtn.addEventListener('click', () => {
            if (!clusterCanvas || !goToFeedbackBtn) { console.error("CRITICAL_ERROR: finishPlacementBtn dependencies missing!"); return; }
            currentMode = 'clustering'; removeActiveDeleteButton();
            experimentData.placementTime = getCurrentTimestamp();
            experimentData.moveHistory.push({ timestamp: experimentData.placementTime, eventType: 'placementEnd', target: 'finishPlacementBtn', details: { message: 'クラスター作成フェーズへ移行' } });
            Object.values(foodContainers).forEach(container => {
                const handle = container.querySelector('.drag-handle');
                if (handle) { handle.style.cursor = 'default'; handle.onmousedown = null; }
            });
            displayFoodDetails(null);
            clusterCanvas.classList.add('active-drawing');
            finishPlacementBtn.style.display = 'none';
            goToFeedbackBtn.style.display = 'inline-block';
            updateStatusMessage('食品を円で囲んでクラスターを作成 (3つ以上中に入れる)、または既存のクラスターをクリックして削除できます。');
        });
    }

    if (goToFeedbackBtn) {
        goToFeedbackBtn.addEventListener('click', () => {
            currentMode = 'clusterFeedback'; removeActiveDeleteButton();
            updateStatusMessage('作成した各クラスターについて、以下の項目を記入してください。');
            if (detailsPanel) {
                detailsPanel.innerHTML = ''; detailsPanel.scrollTop = 0;
                const placeholder = document.createElement('p'); placeholder.id = 'details-placeholder'; placeholder.className = 'info-text'; detailsPanel.appendChild(placeholder);
                if (experimentData.clusters.length === 0) {
                    placeholder.textContent = '作成されたクラスターはありません。このまま保存してください。'; placeholder.style.display = 'block';
                } else {
                    placeholder.style.display = 'none';
                    experimentData.clusters.forEach((cluster, index) => {
                        const itemDiv = document.createElement('div'); itemDiv.className = 'cluster-feedback-item';
                        const labels = cluster.items.map(name => (foodList.find(f=>f.name===name)||{}).label||name ).join('、 ');
                        const itemsText = labels.length > 0 ? ` (内容: ${labels})` : ' (内容なし)';
                        itemDiv.innerHTML = `<h4>クラスター: ${cluster.name}${itemsText}</h4>
                            <label for="reasonCreated_${index}">このクラスターを作成した理由:</label><textarea id="reasonCreated_${index}" data-cluster-index="${index}" data-feedback-type="reasonCreated" rows="3"></textarea>
                            <label for="meaning_${index}">どのような意味があると思いますか？:</label><textarea id="meaning_${index}" data-cluster-index="${index}" data-feedback-type="meaning" rows="3"></textarea>
                            <label for="reasonName_${index}">その名前にした理由:</label><textarea id="reasonName_${index}" data-cluster-index="${index}" data-feedback-type="reasonName" rows="3"></textarea>`;
                        detailsPanel.appendChild(itemDiv);
                    });
                }
            } else { console.error("[CRITICAL_ERROR] detailsPanel not found!"); }
            if(goToFeedbackBtn) goToFeedbackBtn.style.display = 'none';
            if(saveFeedbackAndDataBtn) saveFeedbackAndDataBtn.style.display = 'inline-block';
            if(clusterCanvas) clusterCanvas.classList.remove('active-drawing');
            document.querySelectorAll('.food-container .info-button').forEach(btn => btn.style.pointerEvents = 'none');
            experimentData.moveHistory.push({ timestamp: getCurrentTimestamp(), eventType: 'enterClusterFeedback', target:'application', details: { clusterCount: experimentData.clusters.length } });
        });
    }

    if (saveFeedbackAndDataBtn) {
        saveFeedbackAndDataBtn.addEventListener('click', () => {
            let allProvided = true;
            if (experimentData.clusters.length > 0) {
                for (let i = 0; i < experimentData.clusters.length; i++) {
                    const reasonCreatedEl = document.getElementById(`reasonCreated_${i}`);
                    const meaningEl = document.getElementById(`meaning_${i}`);
                    const reasonNameEl = document.getElementById(`reasonName_${i}`);
                    const checkAndMark = (el) => { if (!el || el.value.trim() === '') { allProvided = false; if(el) el.classList.add('feedback-missing'); return false; } else if(el) { el.classList.remove('feedback-missing'); } return true; };
                    checkAndMark(reasonCreatedEl); checkAndMark(meaningEl); checkAndMark(reasonNameEl);
                }
            }
            if (!allProvided) { alert("全てのクラスターについて、3つのフィードバック項目すべてを記入してください。\n（未記入の項目は枠が赤くなっています）"); return; }
            document.querySelectorAll('.cluster-feedback-item textarea.feedback-missing').forEach(ta => ta.classList.remove('feedback-missing'));
            saveExperimentData();
        });
    }

    if (backToScreen1Btn) {
        backToScreen1Btn.addEventListener('click', () => {
            if (confirm("前の画面に戻りますか？")) { // Removed "入力内容がリセットされることはありません。" as it might be confusing if they expect form data to persist and it doesn't due to page reload logic not handled here.
                showScreen(screen1);
                currentMode = 'intro';
            }
        });
    }
    if (backToScreen2Btn) {
        backToScreen2Btn.addEventListener('click', () => {
            if (confirm("実験説明画面に戻りますか？現在の配置やクラスターの情報はリセットされます。よろしいですか？")) {
                resetScreen3UI();
                showScreen(screen2);
                currentMode = 'instructions';
            }
        });
    }
    if (backToStartBtn) {
        backToStartBtn.addEventListener('click', () => {
            if (confirm("最初の画面に戻りますか？")) {
                // Optionally clear subject info for a full restart
                // subjectNameInput.value = ''; subjectAgeInput.value = ''; subjectEmailInput.value = '';
                // experimentData.subjectInfo = {};
                showScreen(screen1);
                currentMode = 'intro';
            }
        });
    }

    if (clusterCanvas) {
        clusterCanvas.addEventListener('mousedown', handleClusterMouseDown);
        clusterCanvas.addEventListener('click', handleClusterClick);
    }
    try {loadFoodListFromLocalStorage();} catch (e) {console.error("Error loading food list:", e);}
    try {
        if (screen1) showScreen(screen1); else { console.error("CRITICAL: screen1 not found!"); alert("初期画面エラー");}
    } catch (e) {console.error("Error showing screen1:", e);}
    console.log("[DEBUG] initializeApp: Finished.");
}

function initializeExperiment() {
    console.log('[DEBUG] initializeExperiment: Started. Current mode is:', currentMode);
    if (currentMode !== 'placement') {
        currentMode = 'placement'; // Ensure correct mode
    }
    if (!canvasContainer || !clusterCanvas || (clusterCanvas && !ctx) || !detailsPanel) {
        console.error("CRITICAL_ERROR: initializeExperiment - Essential DOM elements or context not found!");
        updateStatusMessage("エラー: 実験エリアの初期化に失敗しました。");
        return;
    }

    try {
        clusterCanvas.width = canvasContainer.clientWidth;
        clusterCanvas.height = canvasContainer.clientHeight;
        if (clusterCanvas.width === 0 || clusterCanvas.height === 0) {
            console.warn(`[WARN] initializeExperiment: clusterCanvas has zero dimensions.`);
        }
        ctx.clearRect(0, 0, clusterCanvas.width, clusterCanvas.height);

        experimentData.startTime = Date.now();
        experimentData.moveHistory = [];
        experimentData.clusters = [];
        experimentData.positions = []; // Reset for new experiment

        if (detailsPanel) { // Reset details panel
            detailsPanel.innerHTML = `
                <h3 id="details-food-name"></h3>
                <img id="details-food-image" src="" alt="選択された食品の画像" style="display:none;">
                <div id="details-food-info"></div>
                <p id="details-placeholder" class="info-text" style="display:block;">食品の[i]ボタンをクリックすると、ここに詳細情報が表示されます。</p>
            `;
        }
        displayFoodDetails(null); // Clear details panel content

        experimentData.moveHistory.push({ timestamp: 0, eventType: 'experimentStart', target: 'experiment', details: { message: '配置フェーズ開始' } });
        canvasContainer.querySelectorAll('.food-container').forEach(fc => fc.remove()); // Clear old food items
        removeActiveDeleteButton();
        foodContainers = {}; // Reset references

        foodList.forEach((food) => {
            const foodContainer = document.createElement('div');
            foodContainer.className = 'food-container';
            foodContainer.dataset.name = food.name;

            const dragHandle = document.createElement('div');
            dragHandle.className = 'drag-handle';
            const actionButton = document.createElement('div');
            actionButton.className = 'info-button'; actionButton.textContent = 'i';
            actionButton.title = `${food.label}について`;
            actionButton.addEventListener('click', (e) => {
                e.stopPropagation();
                if (currentMode === 'placement' || currentMode === 'clustering') {
                    displayFoodDetails(food);
                }
            });
            dragHandle.appendChild(actionButton);
            foodContainer.appendChild(dragHandle);

            const img = document.createElement('img');
            img.src = food.imgSrc; img.alt = food.label; img.className = 'food-image';
            img.onerror = () => { img.alt = `${food.label} (画像読込失敗)`;};
            foodContainer.appendChild(img);
            canvasContainer.appendChild(foodContainer);

            const itemW = foodContainer.offsetWidth, itemH = foodContainer.offsetHeight;
            const maxW = canvasContainer.clientWidth, maxH = canvasContainer.clientHeight;
            const buffer = 5; // Small buffer from edges
            let initialX = Math.max(buffer, Math.floor(Math.random() * (maxW - itemW - 2 * buffer)) + buffer);
            let initialY = Math.max(buffer, Math.floor(Math.random() * (maxH - itemH - 2 * buffer)) + buffer);
             // Fallback if dimensions are problematic
            if (itemW === 0 || itemH === 0 || maxW <= itemW + 2*buffer || maxH <= itemH + 2*buffer) {
                 initialX = buffer; initialY = buffer;
                 console.warn(`[WARN] Fallback placement for ${food.name} due to size constraints or zero dimensions.`);
            }

            foodContainer.style.left = `${initialX}px`; foodContainer.style.top = `${initialY}px`;
            experimentData.positions.push({ name: food.name, x: initialX, y: initialY }); // Store initial position
            experimentData.moveHistory.push({ timestamp: getCurrentTimestamp(), eventType: 'initialPlace', target: food.name, position: { x: initialX, y: initialY }});
            foodContainers[food.name] = foodContainer;
            makeDraggable(foodContainer, dragHandle);
        });
        updateStatusMessage('食品の青いバーをドラッグして自由に配置してください。');
        if(finishPlacementBtn) finishPlacementBtn.style.display = 'inline-block';
        if(goToFeedbackBtn) goToFeedbackBtn.style.display = 'none';
        if(saveFeedbackAndDataBtn) saveFeedbackAndDataBtn.style.display = 'none';
        if(clusterCanvas) clusterCanvas.classList.remove('active-drawing'); // Ensure canvas is not in drawing mode
        document.querySelectorAll('.food-container .info-button').forEach(btn => btn.style.pointerEvents = 'auto');
    } catch (error) {
        console.error("[CRITICAL_ERROR] Error within initializeExperiment main block:", error);
        updateStatusMessage("エラー: 食品アイテムの配置中に問題が発生しました。");
    }
    console.log('[DEBUG] initializeExperiment finished.');
}

function makeDraggable(element, handle) {
    if (!element || !handle || !canvasContainer) {console.error('[ERROR] makeDraggable: missing elements.'); return;}
    let isDragging = false, iMouseX, iMouseY, iElemX, iElemY; // Initial mouse and element positions
    const onMouseDown = (e) => {
        if (currentMode !== 'placement' || e.button !== 0) { handle.style.cursor = 'default'; return; } // Only allow drag in placement mode, left click
        isDragging = true; element.classList.add('dragging'); handle.style.cursor = 'grabbing';
        iMouseX = e.clientX; iMouseY = e.clientY; iElemX = element.offsetLeft; iElemY = element.offsetTop;
        document.addEventListener('mousemove', onMouseMove); document.addEventListener('mouseup', onMouseUp);
        e.preventDefault(); // Prevent text selection, etc.
        experimentData.moveHistory.push({timestamp:getCurrentTimestamp(),eventType:'dragStart',target:element.dataset.name,position:{x:iElemX,y:iElemY}});
    };
    const onMouseMove = (e) => {
        if (!isDragging) return;
        let nX = iElemX + (e.clientX - iMouseX), nY = iElemY + (e.clientY - iMouseY); // Calculate new position
        // Constrain within canvasContainer
        nX = Math.max(0, Math.min(nX, canvasContainer.clientWidth - element.offsetWidth));
        nY = Math.max(0, Math.min(nY, canvasContainer.clientHeight - element.offsetHeight));
        element.style.left = `${nX}px`; element.style.top = `${nY}px`;
    };
    const onMouseUp = () => {
        if (!isDragging) return; isDragging = false; element.classList.remove('dragging');
        handle.style.cursor = (currentMode === 'placement') ? 'grab' : 'default'; // Reset cursor
        document.removeEventListener('mousemove', onMouseMove); document.removeEventListener('mouseup', onMouseUp);
        const fX = element.offsetLeft, fY = element.offsetTop; // Final position
        let pE = experimentData.positions.find(p=>p.name===element.dataset.name); // Update position in data
        if(pE){pE.x=fX;pE.y=fY;}else{experimentData.positions.push({name:element.dataset.name,x:fX,y:fY});} // Should always find
        experimentData.moveHistory.push({timestamp:getCurrentTimestamp(),eventType:'dragEnd',target:element.dataset.name,position:{x:fX,y:fY}});
    };
    handle.onmousedown = onMouseDown; // Attach listener
    handle.style.cursor = (currentMode === 'placement') ? 'grab' : 'default'; // Set initial cursor
}

async function saveExperimentData() {
    console.log('[DEBUG] saveExperimentData: Called');
    showLoading(true, "データを保存中...");
    experimentData.clusters.forEach((cluster, index) => {
        cluster.feedback = { // Ensure feedback object structure
            reasonCreated: document.getElementById(`reasonCreated_${index}`)?.value.trim() || '',
            meaning: document.getElementById(`meaning_${index}`)?.value.trim() || '',
            reasonName: document.getElementById(`reasonName_${index}`)?.value.trim() || ''
        };
    });
    experimentData.moveHistory.push({ timestamp: getCurrentTimestamp(), eventType: 'saveDataAttempt', target: 'system' });
    const dataToSave = {
        subjectInfo: experimentData.subjectInfo,
        foodListUsed: foodList.map(f => ({name: f.name, label: f.label})), // Save names and labels of food items
        finalPositions: experimentData.positions,
        clusters: experimentData.clusters,
        placementTimeSeconds: experimentData.placementTime,
        moveHistory: experimentData.moveHistory,
        experimentStartTimeISO: experimentData.startTime ? new Date(experimentData.startTime).toISOString() : null,
        experimentEndTimeISO: new Date().toISOString()
    };
    try {
        const jsonData = JSON.stringify(dataToSave, null, 2);
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = generateFileName(dataToSave.subjectInfo);
        document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
        updateStatusMessage('データが正常に保存されました。ありがとうございました。');
        if(screen4) showScreen(screen4);
    } catch (error) {
        console.error('[CRITICAL_ERROR] saveExperimentData:', error);
        updateStatusMessage('エラー: データの保存に失敗しました。');
        alert('データの保存に失敗しました。コンソールを確認してください。');
    } finally {
        showLoading(false);
    }
}

// --- クラスター描画関連 ---
function handleClusterMouseDown(e) {
    if (currentMode !== 'clustering' || isDrawingCluster || !clusterCanvas || !ctx) return;
    removeActiveDeleteButton(); isDrawingCluster = true;
    const rect = clusterCanvas.getBoundingClientRect();
    const startX = e.clientX - rect.left, startY = e.clientY - rect.top;
    currentDrawingCluster = {
        id: `cluster_${Date.now()}_${Math.random().toString(36).substr(2,5)}`, type: 'circle',
        centerX: startX, centerY: startY, radius: 0,
        name: '', items: [], color: getRandomClusterColor(), feedback: {}
    };
    clusterCanvas.addEventListener('mousemove', handleClusterMouseMove);
    clusterCanvas.addEventListener('mouseup', handleClusterMouseUp);
    clusterCanvas.addEventListener('mouseleave', handleClusterMouseUp);
    experimentData.moveHistory.push({timestamp:getCurrentTimestamp(),eventType:'clusterDrawStart',target:'clusterCanvas',details:{type:'circle',centerX:startX,centerY:startY}});
}

function handleClusterMouseMove(e) {
    if (!isDrawingCluster || !currentDrawingCluster || currentDrawingCluster.type !== 'circle') return;
    const rect = clusterCanvas.getBoundingClientRect();
    const currentX = e.clientX - rect.left, currentY = e.clientY - rect.top;
    const dx = currentX - currentDrawingCluster.centerX, dy = currentY - currentDrawingCluster.centerY;
    currentDrawingCluster.radius = Math.sqrt(dx * dx + dy * dy);

    ctx.clearRect(0, 0, clusterCanvas.width, clusterCanvas.height);
    drawAllClusters();

    const drawingFillColor = currentDrawingCluster.color.startsWith('rgb(') ?
        currentDrawingCluster.color.replace('rgb(', 'rgba(').replace(')', ', 0.1)') :
        `${currentDrawingCluster.color}1A`; // Approx 10% alpha for hex/named

    drawCircle(currentDrawingCluster.centerX, currentDrawingCluster.centerY, currentDrawingCluster.radius, currentDrawingCluster.color, drawingFillColor, 2, true);
}

function handleClusterMouseUp(e) {
    if (!isDrawingCluster || !currentDrawingCluster || currentDrawingCluster.type !== 'circle') return;
    isDrawingCluster = false;
    clusterCanvas.removeEventListener('mousemove', handleClusterMouseMove);
    clusterCanvas.removeEventListener('mouseup', handleClusterMouseUp);
    clusterCanvas.removeEventListener('mouseleave', handleClusterMouseUp);

    if (currentDrawingCluster.radius < 10) { // Min radius check
        updateStatusMessage('クラスターが小さすぎます。もう一度描画してください。');
        currentDrawingCluster = null; ctx.clearRect(0,0,clusterCanvas.width,clusterCanvas.height); drawAllClusters(); return;
    }
    identifyItemsInCluster(currentDrawingCluster); // Populate items
    if (currentDrawingCluster.items.length < 3) { // Min 3 items check
        updateStatusMessage(`クラスター内の食品が${currentDrawingCluster.items.length}個です。3つ以上になるように作成してください。`);
        experimentData.moveHistory.push({timestamp:getCurrentTimestamp(),eventType:'clusterDrawCancel',target:'clusterCanvas',details:{message:'Less than 3 items',itemCount:currentDrawingCluster.items.length}});
        currentDrawingCluster = null; ctx.clearRect(0,0,clusterCanvas.width,clusterCanvas.height); drawAllClusters(); return;
    }
    const clusterName = prompt("このクラスターの名前を入力してください:", `クラスター${experimentData.clusters.length + 1}`);
    if (clusterName && clusterName.trim() !== "") {
        currentDrawingCluster.name = clusterName.trim();
        experimentData.clusters.push(currentDrawingCluster);
        experimentData.moveHistory.push({timestamp:getCurrentTimestamp(),eventType:'clusterCreated',target:currentDrawingCluster.name,details:{id:currentDrawingCluster.id,type:'circle',radius:currentDrawingCluster.radius,itemCount:currentDrawingCluster.items.length}});
    } else {
        experimentData.moveHistory.push({timestamp:getCurrentTimestamp(),eventType:'clusterDrawCancel',target:'clusterCanvas',details:{message:'No name provided for circle cluster'}});
    }
    currentDrawingCluster = null; ctx.clearRect(0,0,clusterCanvas.width,clusterCanvas.height); drawAllClusters();
}

function identifyItemsInCluster(cluster) {
    if (!cluster || cluster.type !== 'circle' || cluster.radius <= 0) return;
    cluster.items = [];
    Object.values(foodContainers).forEach(container => {
        const rect = container.getBoundingClientRect();
        const cRect = canvasContainer.getBoundingClientRect(); // Use canvasContainer for relative positioning
        const iCX = (rect.left - cRect.left) + rect.width/2, iCY = (rect.top - cRect.top) + rect.height/2;
        const dX = iCX - cluster.centerX, dY = iCY - cluster.centerY;
        if (Math.sqrt(dX*dX + dY*dY) <= cluster.radius) cluster.items.push(container.dataset.name);
    });
}

function handleClusterClick(e) {
    if (currentMode !== 'clustering' || isDrawingCluster || !clusterCanvas || !ctx || experimentData.clusters.length === 0) return;
    removeActiveDeleteButton(); const rect = clusterCanvas.getBoundingClientRect();
    const cX = e.clientX - rect.left, cY = e.clientY - rect.top;
    let clClicked = null, clIdx = -1;
    for (let i = experimentData.clusters.length - 1; i >= 0; i--) { // Check from top-most
        const cl = experimentData.clusters[i];
        if (cl.type === 'circle') {
            const dX_ = cX - cl.centerX, dY_ = cY - cl.centerY;
            if (Math.sqrt(dX_*dX_ + dY_*dY_) <= cl.radius) { clClicked = cl; clIdx = i; break; }
        }
    }
    if (clClicked) {
        selectedClusterIndexForDeletion = clIdx;
        createAndShowDeleteButton(clClicked, e.clientX, e.clientY); // Pass screen coords for button positioning
    }
}

function createAndShowDeleteButton(cluster, screenX, screenY) {
    removeActiveDeleteButton(); activeDeleteButton = document.createElement('button');
    activeDeleteButton.id = 'dynamicDeleteClusterBtn'; activeDeleteButton.textContent = `「${cluster.name}」を削除`;
    document.body.appendChild(activeDeleteButton); // Append to body to overlay
    activeDeleteButton.style.left = `${screenX + 5}px`; activeDeleteButton.style.top = `${screenY + 5}px`;
    activeDeleteButton.onclick = () => {
        if (selectedClusterIndexForDeletion > -1 && selectedClusterIndexForDeletion < experimentData.clusters.length) {
            const delCl = experimentData.clusters.splice(selectedClusterIndexForDeletion, 1)[0];
            experimentData.moveHistory.push({timestamp:getCurrentTimestamp(),eventType:'clusterDelete',target:delCl.name,details:{id:delCl.id}});
        }
        selectedClusterIndexForDeletion = -1; removeActiveDeleteButton(); drawAllClusters();
    };
}

function removeActiveDeleteButton() {
    if (activeDeleteButton) { activeDeleteButton.remove(); activeDeleteButton = null; }
}

function drawCircle(centerX, centerY, radius, strokeStyle, fillStyle, lineWidth, isFilled = true) {
    if(!ctx || radius <= 0) return; ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    if (strokeStyle) ctx.strokeStyle = strokeStyle; if (lineWidth) ctx.lineWidth = lineWidth; ctx.stroke();
    if (isFilled && fillStyle) { ctx.fillStyle = fillStyle; ctx.fill(); }
}

function drawPolygon(points, strokeStyle, fillStyle, lineWidth, isFilled = true) {
    // This function is not actively used for cluster creation anymore but kept for potential other uses.
    if (!ctx || !points || points.length < 2) return; ctx.beginPath(); ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) ctx.lineTo(points[i].x, points[i].y);
    if (points.length > 2) ctx.closePath();
    if (strokeStyle) ctx.strokeStyle = strokeStyle; if (lineWidth) ctx.lineWidth = lineWidth; ctx.stroke();
    if (isFilled && fillStyle && points.length > 2) { ctx.fillStyle = fillStyle; ctx.fill(); }
}

function calculatePolygonArea(points) {
    // Not actively used.
    let area = 0; if (!points || points.length < 3) return 0;
    for (let i = 0; i < points.length; i++) {
        let j = (i + 1) % points.length; area += points[i].x * points[j].y; area -= points[j].x * points[i].y;
    } return Math.abs(area / 2);
}

function drawAllClusters() {
    if (!ctx || !clusterCanvas) return;
    ctx.clearRect(0, 0, clusterCanvas.width, clusterCanvas.height);
    experimentData.clusters.forEach(cluster => {
        if (cluster.type === 'circle' && cluster.radius > 0) {
            const fillColor = cluster.color.startsWith('rgb(') ?
                cluster.color.replace('rgb(', 'rgba(').replace(')', ', 0.2)') : // Approx 20% alpha for rgb
                `${cluster.color}33`; // Approx 20% alpha for hex/named
            drawCircle(cluster.centerX, cluster.centerY, cluster.radius, cluster.color, fillColor, 2, true);
        }
    });
}

function getRandomClusterColor() {
    const r = Math.floor(Math.random() * 180) + 50; const g = Math.floor(Math.random() * 180) + 50; const b = Math.floor(Math.random() * 180) + 50;
    return `rgb(${r},${g},${b})`;
}

function generateFileName(info) {
    const now = new Date();
    const dateStr = `${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2,'0')}${now.getDate().toString().padStart(2,'0')}`;
    const timeStr = `${now.getHours().toString().padStart(2,'0')}${now.getMinutes().toString().padStart(2,'0')}`;
    const subjectName = info && info.name ? info.name.replace(/\s+/g, '_') : 'UnknownSubject';
    return `FoodCognitiveMap_${subjectName}_${dateStr}_${timeStr}.json`;
}

function showLoading(show, message = '') {
    if (!loadingSpinner || !statusMessage) return;
    if (show) { loadingSpinner.classList.add('active'); statusMessage.textContent = message || '読み込み中...';}
    else { loadingSpinner.classList.remove('active'); /* Optionally clear message or leave it */}
}

function updateStatusMessage(message) {
    if (!statusMessage) return; statusMessage.textContent = message; console.log(`[STATUS] ${message}`);
}

document.addEventListener('DOMContentLoaded', initializeApp);な
