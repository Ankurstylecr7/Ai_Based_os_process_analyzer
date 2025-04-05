document.addEventListener("DOMContentLoaded", () => {
    // DOM elements
    const metricsElements = {
        cpu: document.querySelector("[data-type='cpu'] .meter-progress"),
        memory: document.querySelector("[data-type='memory'] .meter-progress"),
        disk: document.querySelector("[data-type='disk'] .meter-progress"),
        statusIndicator: document.getElementById("status"),
        cpuValue: document.querySelector("[data-type='cpu'] .meter-value"),
        memoryValue: document.querySelector("[data-type='memory'] .meter-value"),
        diskValue: document.querySelector("[data-type='disk'] .meter-value"),
        anomalyStatus: document.getElementById("anomaly-status"),
        anomaliesList: document.getElementById("anomalies-list"),
        suggestionsList: document.getElementById("suggestions-list")
    };

    // Validate DOM elements to prevent errors
    if (!metricsElements.cpu || !metricsElements.memory || !metricsElements.disk || 
        !metricsElements.statusIndicator || !metricsElements.anomaliesList || !metricsElements.suggestionsList) {
        console.error("Missing required DOM elements. Please check your HTML structure.");
        return;
    }

    // Configuration
    const fetchInterval = 5000; // 5-second updates

    // Navigation function (optional, since only Overview is visible)
    window.showSection = function (sectionId) {
        // Hide all sections
        const sections = document.querySelectorAll(".section");
        sections.forEach(section => {
            section.style.display = "none";
        });

        // Show selected section
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.style.display = "block";
        }

        // Update active link
        const links = document.querySelectorAll(".sidebar a");
        links.forEach(link => {
            link.classList.remove("active");
        });
        const activeLink = document.querySelector(`.sidebar a[onclick="showSection('${sectionId}')"]`);
        if (activeLink) {
            activeLink.classList.add("active");
        }
    };

    // Fetch system metrics (mocked data)
   // Fetch system metrics (mocked data)
async function fetchSystemMetrics() {
    try {
        showLoadingState("metrics"); // Show loading state

        // Simulate a delay to make the loading state visible
        await new Promise(resolve => setTimeout(resolve, 500)); // 500ms delay

        // Simulate API response with mocked data
        const mockData = {
            cpu_usage: Math.floor(Math.random() * 100), // Random CPU usage between 0-100
            memory_usage: Math.floor(Math.random() * 100), // Random Memory usage between 0-100
            disk_usage: Math.floor(Math.random() * 100), // Random Disk usage between 0-100
            status: Math.random() > 0.7 ? "Anomaly" : "Normal" // Randomly generate Anomaly/Normal
        };
        updateMetrics(mockData); // Update metrics with mocked data
    } catch (error) {
        handleFetchError(error.message, "metrics"); // Handle fetch errors
    } finally {
        // Schedule next fetch
        setTimeout(fetchSystemMetrics, fetchInterval);
    }
}

// Fetch anomalies (mocked data)
async function fetchAnomalies() {
    try {
        showLoadingState("anomalies"); // Show loading state

        // Simulate a delay to make the loading state visible
        await new Promise(resolve => setTimeout(resolve, 500)); // 500ms delay

        // Simulate API response with mocked data
        const mockData = {
            status: Math.random() > 0.7 ? "Anomaly" : "Normal", // Randomly generate Anomaly/Normal
            suggestions: [
                "High resource usage detected. Close unnecessary applications.",
                "Check for background processes.",
                "Monitor CPU temperature to prevent overheating."
            ]
        };
        updateAnomalies(mockData); // Update anomalies with mocked data
    } catch (error) {
        handleFetchError(error.message, "anomalies"); // Handle fetch errors
    } finally {
        // Schedule next fetch
        setTimeout(fetchAnomalies, fetchInterval);
    }
}

    // Update metrics
    function updateMetrics(data) {
        // Update CPU meter
        updateMeter(
            "cpu",
            data?.cpu_usage || 0,
            metricsElements.cpu,
            metricsElements.cpuValue,
            data?.status || "Normal"
        );

        // Update Memory meter
        updateMeter(
            "memory",
            data?.memory_usage || 0,
            metricsElements.memory,
            metricsElements.memoryValue,
            "Normal" // Memory doesn't depend on anomaly status
        );

        // Update Disk meter
        updateMeter(
            "disk",
            data?.disk_usage || 0,
            metricsElements.disk,
            metricsElements.diskValue,
            "Normal" // Disk doesn't depend on anomaly status
        );

        // Update Status Indicator
        metricsElements.statusIndicator.textContent = data?.status || "N/A";
        metricsElements.statusIndicator.className = `status-indicator ${data?.status?.toLowerCase() || "normal"}`;

        // Update Suggestions based on status
        updateSuggestions(data?.status || "Normal");
    }

    // Generic meter updater
    function updateMeter(type, value, progressCircle, textElement, status) {
        if (!progressCircle || !textElement) return;

        const circumference = 2 * Math.PI * 45; // Radius from SVG
        const offset = circumference - ((value || 0) / 100) * circumference;

        // Update progress circle and text
        progressCircle.style.strokeDashoffset = offset;
        textElement.textContent = `${value || 0}%`;

        // Color coding for anomalies (only CPU for now)
        if (type === "cpu" && status === "Anomaly") {
            progressCircle.style.stroke = "#ff0000"; // Red for anomalies
        } else {
            progressCircle.style.stroke = "#00ff00"; // Green for normal
        }
    }

    // Update anomalies
    function updateAnomalies(data) {
        metricsElements.anomalyStatus.textContent = data?.status || "N/A";
        metricsElements.anomaliesList.innerHTML = "";

        if (data?.status === "Anomaly" && Array.isArray(data.suggestions)) {
            // Display anomaly suggestions
            data.suggestions.forEach(suggestion => {
                const li = document.createElement("li");
                li.textContent = suggestion;
                metricsElements.anomaliesList.appendChild(li);
            });
        } else {
            // No anomalies detected
            metricsElements.anomaliesList.innerHTML = "<li>No anomalies detected.</li>";
        }
    }

    // Update suggestions based on status
    function updateSuggestions(status) {
        const suggestions = metricsElements.suggestionsList;
        suggestions.innerHTML = "";

        if (status === "Anomaly") {
            // Display suggestions for anomalies
            suggestions.innerHTML = `
                <li>High resource usage detected. Close unnecessary applications.</li>
                <li>Check for background processes.</li>
                <li>Monitor CPU temperature to prevent overheating.</li>
            `;
        } else {
            // System is operating normally
            suggestions.innerHTML = "<li>System is operating normally.</li>";
        }
    }

    // Show loading state
    // Show loading state
// Show loading state
function showLoadingState(section) {
    if (section === "metrics") {
        // Reset all meters to loading
        metricsElements.cpu.style.strokeDashoffset = 283; // Full circle (empty)
        metricsElements.cpuValue.textContent = "Loading...";
        metricsElements.memory.style.strokeDashoffset = 283;
        metricsElements.memoryValue.textContent = "Loading...";
        metricsElements.disk.style.strokeDashoffset = 283;
        metricsElements.diskValue.textContent = "Loading...";
        metricsElements.statusIndicator.textContent = "Loading..."; // Update status indicator
        metricsElements.statusIndicator.className = "status-indicator loading"; // Add loading class
    } else if (section === "anomalies") {
        // Reset anomalies to loading
        metricsElements.anomalyStatus.textContent = "Loading..."; // Update anomaly status
        metricsElements.anomaliesList.innerHTML = "<li>Loading...</li>"; // Update anomalies list
    }
}
    // Handle fetch errors
    function handleFetchError(message, section) {
        if (section === "metrics") {
            // Reset metrics to error state
            metricsElements.cpu.style.strokeDashoffset = 283;
            metricsElements.cpuValue.textContent = "Error";
            metricsElements.memory.style.strokeDashoffset = 283;
            metricsElements.memoryValue.textContent = "Error";
            metricsElements.disk.style.strokeDashoffset = 283;
            metricsElements.diskValue.textContent = "Error";
            metricsElements.statusIndicator.textContent = "Connection Failed";
        } else if (section === "anomalies") {
            metricsElements.anomalyStatus.textContent = "Error";
            metricsElements.anomaliesList.innerHTML = "<li>Connection failed</li>";
        }
        console.error(`Error fetching ${section}:`, message);
    }

    // Initialize monitoring
    function startMonitoring() {
        // Clear previous timeouts
        clearTimeout(metricsTimeout);
        clearTimeout(anomaliesTimeout);

        // Initial fetches
        fetchSystemMetrics();
        fetchAnomalies();

        // Schedule recurring fetches
        metricsTimeout = setTimeout(fetchSystemMetrics, fetchInterval);
        anomaliesTimeout = setTimeout(fetchAnomalies, fetchInterval);
    }

    // Global timeout variables
    let metricsTimeout, anomaliesTimeout;

    // Start monitoring on page load
    startMonitoring();

    // Cleanup on unload (optional)
    window.addEventListener("beforeunload", () => {
        clearTimeout(metricsTimeout);
        clearTimeout(anomaliesTimeout);
    });
});