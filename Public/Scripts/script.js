const dataset = async function () {
    const ctx = document.getElementById("donationChart");

    const response = await fetch('/data', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
    console.log(data);

    const donationno = document.querySelector(".no").innerHTML = "Total Doners<br>" + data.totalDoners;
    const donationamt = document.querySelector(".amt").innerHTML = "Donation Amount<br>RS." + data.totalAmount;

    new Chart(ctx, {
        type: "bar",
        data: {
            labels: data.months,

            datasets: [
                {
                    label: "UPI Donations",
                    data: data.data1,
                    backgroundColor: "#599de2e4",
                    stack: "donations"
                },

                {
                    label: "Total Donations (Line)",
                    data: data.data1,
                    type: "line",
                    borderColor: "black",
                    borderWidth: 2,
                    fill: false,
                    tension: 0.3
                }
            ]
        },

        options: {
            plugins: {
                tooltip: { enabled: true }
            },

            responsive: true,

            scales: {
                x: {
                    stacked: true
                },
                y: {
                    stacked: true,
                    beginAtZero: true
                }
            }
        }
    });
}

window.onload = dataset;
document.getElementById("refresh").addEventListener("click", () => {

    alert("Data Refreshed");
    dataset();

});
