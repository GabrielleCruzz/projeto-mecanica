const ctx = document.getElementById("graficoFinanceiro");

new Chart(ctx, {
    type: "line",

    data: {
        labels: [
            "Jan",
            "Fev",
            "Mar",
            "Abr",
            "Mai",
            "Jun",
            "Jul",
            "Ago",
            "Set",
            "Out",
            "Nov",
            "Dez"
        ],

        datasets: [{
            label: "Faturamento",

            data: [
                3200,
                4100,
                3800,
                5200,
                6750,
                5800,
                7300,
                5500,
                5800,
                5100
            ],

            backgroundColor: "#1d5cb9",
            borderRadius: 10
        }]
    },

    options: {
        responsive: true,
        maintainAspectRatio: false,

        plugins: {
            legend: {
                display: false
            },

            tooltip: {
                callbacks: {
                    label: function(context) {
                        return `R$ ${context.raw}`;
                    }
                }
            }
        }
    }
});