/* ==========================================
Le code JavaScript ne sert qu’à ouvrir/fermer le menu et à afficher le nom de la texture choisie.
L’application des textures (changer le fond) se fait sans JavaScript : chaque texture est déjà présente dans le code HTML/CSS, et JS se contente d’afficher ou de cacher les calques correspondants.
---------------------------------------------
The JavaScript code only handles opening/closing the menu and displaying the selected texture name.
The application of textures (changing the background) is done without JavaScript : each texture is already present in the HTML/CSS code, and JavaScript simply shows or hides the corresponding layers.
========================================== */        

        const dropdownSelector = document.getElementById('dropdownSelector');
        const menuTextures = document.getElementById('menuTextures');
        const dropdownArrow = document.getElementById('dropdownArrow');
        const selectedTextureDisplay = document.getElementById('selectedTextureDisplay');

        dropdownSelector.addEventListener('click', function(e) {
            e.stopPropagation();
            menuTextures.classList.toggle('open');
            dropdownArrow.classList.toggle('open');
        });

        document.addEventListener('click', function(e) {
            if (!dropdownSelector.contains(e.target) && !menuTextures.contains(e.target)) {
                menuTextures.classList.remove('open');
                dropdownArrow.classList.remove('open');
            }
        });

        function switchTexture(index, label) {
            document.querySelectorAll('.fond-texture-svg').forEach(el => {
                el.classList.remove('active');
            });
            document.getElementById('tex-' + index).classList.add('active');

            document.querySelectorAll('.btn-texture').forEach((btn) => {
                if(btn.innerText.startsWith(index + '.')) btn.classList.add('active');
                else btn.classList.remove('active');
            });

            document.getElementById('page-title').innerText = label;
            document.getElementById('texture-id').innerText = `Active specimen : #${index} / 41`;
            selectedTextureDisplay.innerText = `${index}. ${label.substring(0, 30)}${label.length > 30 ? '...' : ''}`;
            
            menuTextures.classList.remove('open');
            dropdownArrow.classList.remove('open');
        }