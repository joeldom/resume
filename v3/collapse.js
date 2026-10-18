document.addEventListener('DOMContentLoaded', function() {
    var links = document.querySelectorAll('.toggle-link');
    var allLists = document.querySelectorAll('ul');
    var toggleAllLink = document.getElementById('toggle-all-link');

    function createSvgIcon(direction) {
        var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('focusable', 'false');
        svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        svg.setAttribute('xmlns', 'https://www.w3.org/2000/svg');
        svg.setAttribute('aria-hidden', 'true');
        svg.setAttribute('viewBox', '0 0 20 20');
        svg.setAttribute('class', 'svg-icon ' + direction + '-icon');
        svg.setAttribute('style', 'display: inline;');

        var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        if (direction === 'collapsed') {
            path.setAttribute('d', 'M11.8 2.8L10.8 3.8 16.2 9.3 1 9.3 1 10.7 16.2 10.7 10.8 16.2 11.8 17.2 19 10z');
        } else {
            path.setAttribute('d', 'M8.2 17.2L9.2 16.2 3.8 10.7 19 10.7 19 9.3 3.8 9.3 9.2 3.8 8.2 2.8 1 10z');
        }
        svg.appendChild(path);
        return svg;
    }

    links.forEach(function(link) {
        var targetId = link.getAttribute('data-target');
        var targetList = document.getElementById(targetId);

        var collapsedIcon = createSvgIcon('collapsed');
        var expandedIcon = createSvgIcon('expanded');
        expandedIcon.style.display = 'none';

        link.appendChild(collapsedIcon);
        link.appendChild(expandedIcon);

        // Set initial link text based on initial state
        if (targetList.classList.contains('collapse')) {
            link.firstChild.nodeValue = 'Show Details';
        } else {
            link.firstChild.nodeValue = 'Hide';
            collapsedIcon.style.display = 'none';
            expandedIcon.style.display = 'inline';
        }

        link.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent the default link behavior
            targetList.classList.toggle('collapse');

            // Update link text and icon based on the state
            if (targetList.classList.contains('collapse')) {
                this.firstChild.nodeValue = 'Show Details';
                collapsedIcon.style.display = 'inline';
                expandedIcon.style.display = 'none';
            } else {
                this.firstChild.nodeValue = 'Hide';
                collapsedIcon.style.display = 'none';
                expandedIcon.style.display = 'inline';
            }
        });
    });

    toggleAllLink.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent the default link behavior
        var allCollapsed = Array.from(allLists).every(list => list.classList.contains('collapse'));
        allLists.forEach(function(list) {
            if (allCollapsed) {
                list.classList.remove('collapse');
            } else {
                list.classList.add('collapse');
            }
        });
        links.forEach(function(link) {
            var targetId = link.getAttribute('data-target');
            var targetList = document.getElementById(targetId);
            var collapsedIcon = link.querySelector('.collapsed-icon');
            var expandedIcon = link.querySelector('.expanded-icon');
            if (targetList.classList.contains('collapse')) {
                link.firstChild.nodeValue = 'Show Details';
                collapsedIcon.style.display = 'inline';
                expandedIcon.style.display = 'none';
            } else {
                link.firstChild.nodeValue = 'Hide';
                collapsedIcon.style.display = 'none';
                expandedIcon.style.display = 'inline';
            }
        });
        this.firstChild.nodeValue = allCollapsed ? 'Hide Details' : 'Show Details';
    });
});