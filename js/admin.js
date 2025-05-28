// 제품 데이터 관리
const products = {
    유선카드단말기: {
        name: '유선카드단말기',
        category: '카드단말기',
        imageUrl: 'https://cdn.imweb.me/thumbnail/20250307/47dd13ec4e895.png',
        description: '안정적인 유선 연결로 끊김없는 결제 서비스를 제공하는 카드단말기입니다.',
        detailHtml: ''
    },
    무선카드단말기: {
        name: '무선카드단말기',
        category: '카드단말기',
        imageUrl: 'https://blog.kakaocdn.net/dn/ctbmIM/btsIGJB3gPi/2wvzRASK0sniQVjceZG9hk/img.jpg',
        description: '이동성이 자유로운 무선 카드단말기로, 배터리 지속시간이 길고 언제 어디서나 결제가 가능합니다.',
        detailHtml: ''
    },
    POS시스템: {
        name: 'POS시스템',
        category: 'POS',
        imageUrl: 'https://blog.kakaocdn.net/dn/b6UuXs/btsIJc3rJ0H/ZhZWwDnymTSM3SsXQOdwK1/img.jpg',
        description: '매출 관리, 재고 관리, 고객 데이터 관리까지 한번에 해결할 수 있는 통합 POS 시스템입니다.',
        detailHtml: ''
    },
    키오스크: {
        name: '키오스크',
        category: '키오스크',
        imageUrl: 'https://whee.kr/web/product/big/202303/2db0851b77a8c12483d49c54c25b2d43.png',
        description: '인건비 절감과 효율적인 주문 처리가 가능한 무인 주문 시스템입니다.',
        detailHtml: ''
    },
    태블릿오더: {
        name: '태블릿오더',
        category: '주문시스템',
        imageUrl: 'https://m.heyposmall.com/web/product/medium/202504/ef8e87072ac9921c9c8149bed8b5e5ec.png',
        description: '테이블에서 직접 주문할 수 있는 편리한 시스템입니다.',
        detailHtml: ''
    },
    PG결제시스템: {
        name: 'PG결제시스템',
        category: '결제시스템',
        imageUrl: 'https://bignet.company/data/goods/1/2023/07/143_temp_16905657957541view.jpg',
        description: '온라인 결제를 위한 안전하고 편리한 PG 결제 시스템입니다.',
        detailHtml: ''
    }
};

// 초기 데이터 로드
document.addEventListener('DOMContentLoaded', () => {
    // localStorage에서 저장된 제품 데이터 불러오기
    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
        Object.assign(products, JSON.parse(savedProducts));
    }

    // 관리자 로그인 이벤트 리스너
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // 제품 수정 폼 이벤트 리스너
    const productEditForm = document.getElementById('productEditForm');
    if (productEditForm) {
        productEditForm.addEventListener('submit', handleProductEdit);
    }

    // 제품 수정 버튼 이벤트 리스너
    const editButtons = document.querySelectorAll('.edit-product-btn');
    editButtons.forEach(btn => {
        btn.addEventListener('click', () => openProductEditModal(btn.dataset.product));
    });
});

// 관리자 로그인 처리
function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username === 'moavan' && password === '0000') {
        document.getElementById('loginModal').style.display = 'none';
        document.getElementById('adminDashboard').style.display = 'block';
        loadProductList();
    } else {
        document.getElementById('loginError').style.display = 'block';
    }
}

// 제품 목록 로드
function loadProductList() {
    const productList = document.getElementById('productList');
    if (!productList) return;

    productList.innerHTML = '';
    Object.entries(products).forEach(([id, product]) => {
        productList.innerHTML += `
            <tr>
                <td class="py-2 px-4 border-b">${product.name}</td>
                <td class="py-2 px-4 border-b">${product.category}</td>
                <td class="py-2 px-4 border-b">
                    <button class="admin-action-btn edit-product-btn" data-product="${id}">수정</button>
                    <button class="admin-action-btn admin-delete-btn" data-product="${id}">삭제</button>
                </td>
            </tr>
        `;
    });

    // 수정 버튼 이벤트 리스너 다시 연결
    document.querySelectorAll('.edit-product-btn').forEach(btn => {
        btn.addEventListener('click', () => openProductEditModal(btn.dataset.product));
    });
}

// 제품 수정 모달 열기
function openProductEditModal(productId) {
    const product = products[productId];
    if (!product) return;

    document.getElementById('editProductId').value = productId;
    document.getElementById('editProductName').value = product.name;
    document.getElementById('editProductCategory').value = product.category;
    document.getElementById('editProductImage').value = product.imageUrl;
    document.getElementById('editProductDescription').value = product.description;
    document.getElementById('editProductDetail').value = product.detailHtml || '';

    document.getElementById('productEditModal').style.display = 'block';
}

// 제품 수정 처리
function handleProductEdit(e) {
    e.preventDefault();

    const productId = document.getElementById('editProductId').value;
    const name = document.getElementById('editProductName').value;
    const category = document.getElementById('editProductCategory').value;
    const imageUrl = document.getElementById('editProductImage').value;
    const description = document.getElementById('editProductDescription').value;
    const detailHtml = document.getElementById('editProductDetail').value;

    // 제품 정보 업데이트
    products[productId] = {
        name,
        category,
        imageUrl,
        description,
        detailHtml
    };

    // localStorage에 저장
    localStorage.setItem('products', JSON.stringify(products));

    // UI 업데이트
    updateProductCard(productId);
    loadProductList();

    // 모달 닫기
    document.getElementById('productEditModal').style.display = 'none';

    alert('제품 정보가 성공적으로 저장되었습니다.');
}

// 제품 카드 UI 업데이트
function updateProductCard(productId) {
    const product = products[productId];
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        const titleElement = card.querySelector('.product-title');
        if (titleElement && titleElement.textContent === productId) {
            card.querySelector('.product-title').textContent = product.name;
            card.querySelector('.product-desc').textContent = product.description;
            card.querySelector('.product-image img').src = product.imageUrl;
            card.querySelector('.product-detail-btn').setAttribute('data-product', product.name);
        }
    });
} 