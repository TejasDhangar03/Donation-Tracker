var mychart = null;
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

    mychart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: data.months,

            datasets: [
                {
                    label: "Total Donations",
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

document.querySelector(".submit").addEventListener("click", async () => {
    const name = document.getElementById("name").value;
    const amount = document.getElementById("amount").value;
    const date = document.getElementById("date").value;
    if (name === "" || amount === "" || date === "") {
        alert("Please fill all the fields");
        return;
    } else {
        console.log(name, amount, date);
        const response = await fetch('/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name,
                amount,
                date
            })
        });
        const data = await response.json();
        if (data.status === 200) {
            alert("Data Inserted");
            console.log(data);
            mychart.update();
            window.location.reload();
        }
        else {
            alert("Error Occured");
        }
    }
});
