document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("search");
  const productList = document.getElementById("product-list");
  const products = Array.from(productList.getElementsByClassName("card"));
  const categorySelect = document.getElementById("category");
  const sortSelect = document.getElementById("sort");
  const headings = Array.from(productList.querySelectorAll("h3.category"));
  let defaultOrder = products.slice();
  let cartItems = [];

  function normalize(str) {
    return String(str || "").toLowerCase().replace(/[\s\-_]/g, "");
  }

  function applyFilters() {
    const searchText = (searchInput?.value || "").toLowerCase().trim();
    const selectedCategory = (categorySelect?.value || "all");

    products.forEach(prod => {
      const name = (prod.dataset.name || "").toLowerCase();
      const cat = prod.dataset.category || "";
      const matchesSearch = name.includes(searchText);
      const matchesCategory =
        selectedCategory === "all" ||
        normalize(cat) === normalize(selectedCategory);
      prod.style.display = (matchesSearch && matchesCategory) ? "" : "none";
    });

    headings.forEach(heading => {
      let node = heading.nextElementSibling;
      let hasVisible = false;
      while (node && !(node.tagName === "H3" && node.classList.contains("category"))) {
        if (node.classList && node.classList.contains("card") && node.style.display !== "none") {
          hasVisible = true;
          break;
        }
        node = node.nextElementSibling;
      }
      heading.style.display = hasVisible ? "block" : "none";
    });

    sortProducts();
  }

  function getVisibleProductsInGroup(group) {
    return group.filter(g => g.style.display !== "none");
  }

  function sortProducts() {
    if (!sortSelect) return;
    const option = sortSelect.value;

    headings.forEach(heading => {
      let node = heading.nextElementSibling;
      const group = [];
      while (node && !(node.tagName === "H3" && node.classList.contains("category"))) {
        if (node.classList && node.classList.contains("card")) group.push(node);
        node = node.nextElementSibling;
      }

      const visibleGroup = getVisibleProductsInGroup(group);
      if (visibleGroup.length <= 1) return;

      if (option === "default") {
        visibleGroup.sort((a, b) => defaultOrder.indexOf(a) - defaultOrder.indexOf(b));
      } else {
        visibleGroup.sort((a, b) => {
          const nameA = (a.dataset.name || "").toLowerCase();
          const nameB = (b.dataset.name || "").toLowerCase();
          const priceA = parseFloat((a.querySelector(".price")?.textContent || "").replace(/[^\d.]/g, "")) || 0;
          const priceB = parseFloat((b.querySelector(".price")?.textContent || "").replace(/[^\d.]/g, "")) || 0;

          if (option === "name") return nameA.localeCompare(nameB);
          if (option === "price-asc") return priceA - priceB;
          if (option === "price-desc") return priceB - priceA;
          return 0;
        });
      }

      visibleGroup.forEach(el => productList.removeChild(el));
      let insertBeforeNode = heading.nextElementSibling;
      visibleGroup.forEach(el => productList.insertBefore(el, insertBeforeNode));
    });
  }

  document.querySelectorAll(".rating").forEach(ratingDiv => {
    const text = ratingDiv.textContent || "";
    const initial = parseInt(ratingDiv.dataset.rating) || (text.match(/⭐/g)?.length || 0);
    ratingDiv.dataset.rating = initial;
    ratingDiv.innerHTML = "";
    for (let i = 1; i <= 5; i++) {
      const star = document.createElement("span");
      star.innerHTML = i <= initial ? "⭐" : "☆";
      star.dataset.value = i;
      star.addEventListener("click", () => {
        ratingDiv.querySelectorAll("span").forEach((s, idx) => {
          s.innerHTML = idx < i ? "⭐" : "☆";
        });
        ratingDiv.dataset.rating = i;
      });
      ratingDiv.appendChild(star);
    }
  });

  const cart = document.getElementById("floating-cart");
  const cartCount = document.getElementById("cart-count");
  const cartDetails = document.getElementById("cart-details");
  const cartItemsContainer = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");

  function updateCart() {
    cartCount.textContent = cartItems.length;
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cartItems.forEach((item, index) => {
      const li = document.createElement("li");
      li.textContent = `${item.name} - ₱${item.price.toFixed(2)}`;

      const removeBtn = document.createElement("button");
      removeBtn.textContent = "✖";
      removeBtn.style.marginLeft = "10px";
      removeBtn.style.cursor = "pointer";

      removeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        cartItems.splice(index, 1);
        updateCart();
      });

      li.appendChild(removeBtn);
      cartItemsContainer.appendChild(li);
      total += item.price;
    });

    cartTotal.textContent = `Total: ₱${total.toFixed(2)}`;
  }

  cart.addEventListener("click", () => {
    cartDetails.classList.toggle("visible");
  });

  document.querySelectorAll(".btn:not(.contact-btn)").forEach(button => {
    button.addEventListener("click", (e) => {
      e.stopPropagation();
      const card = button.closest(".card");
      const name = card.dataset.name;
      const price = parseFloat(card.querySelector(".price").textContent.replace(/[^\d.]/g, ""));
      cartItems.push({ name, price });
      updateCart();

      button.innerText = "✔ Added!";
      button.disabled = true;
      setTimeout(() => {
        button.innerText = "Add to Cart";
        button.disabled = false;
      }, 1500);
    });
  });

  if (searchInput) searchInput.addEventListener("input", applyFilters);
  if (categorySelect) categorySelect.addEventListener("change", applyFilters);
  if (sortSelect) sortSelect.addEventListener("change", () => sortProducts());

  applyFilters();
});