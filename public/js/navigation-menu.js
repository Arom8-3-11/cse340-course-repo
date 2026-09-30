const navigation = document.querySelector('.site-navigation');

if (navigation) {
    const toggle = navigation.querySelector('.nav-toggle');
    const menu = navigation.querySelector('#primary-navigation');

    const closeMenu = () => {
        navigation.dataset.menuOpen = 'false';
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Open navigation');
    };

    toggle.addEventListener('click', () => {
        const isOpen = navigation.dataset.menuOpen === 'true';
        navigation.dataset.menuOpen = String(!isOpen);
        toggle.setAttribute('aria-expanded', String(!isOpen));
        toggle.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
    });

    menu.addEventListener('click', (event) => {
        if (event.target.closest('a')) {
            closeMenu();
        }
    });

    document.addEventListener('click', (event) => {
        if (!navigation.contains(event.target)) {
            closeMenu();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeMenu();
            toggle.focus();
        }
    });

    window.matchMedia('(min-width: 701px)').addEventListener('change', (event) => {
        if (event.matches) {
            closeMenu();
        }
    });
}