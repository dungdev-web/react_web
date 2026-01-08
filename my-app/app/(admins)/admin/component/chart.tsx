"use client"
import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { ChartOptions } from "chart.js/auto";

const NestedDonutChart = () => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;

    // Khai báo options ở TRONG useEffect
    const options: ChartOptions<"doughnut"> = {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "80%",
      plugins: {
        legend: { display: false },
        datalabels: { display: false },
      },
    };

    // Hủy chart cũ nếu có
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const labels = ["Organic", "Social", "Direct"];
    const dataValues = [80, 60, 50];
    const backgroundColors = ["#b134eb", "#2979ff", "#26c6da"];

    const chart = new Chart(ctx, {
      type: "doughnut",
      data: {
        datasets: [
          {
            label: "Organic",
            data: [dataValues[0], 100 - dataValues[0]],
            backgroundColor: [backgroundColors[0], "rgba(255, 255, 255, 0)"],
            borderWidth: 0,
          },
          {
            label: "Social",
            data: [dataValues[1], 100 - dataValues[1]],
            backgroundColor: [backgroundColors[1], "rgba(255, 255, 255, 0)"],
            borderWidth: 0,
          },
          {
            label: "Direct",
            data: [dataValues[2], 100 - dataValues[2]],
            backgroundColor: [backgroundColors[2], "rgba(255, 255, 255, 0)"],
            borderWidth: 0,
          },
        ],
      },
      options,
      plugins: [ChartDataLabels],
    });

    chartInstanceRef.current = chart;

    // Tạo legend thủ công
    const legendContainer = document.getElementById("legend");
    if (legendContainer) {
      legendContainer.innerHTML = ""; // clear cũ

      labels.forEach((label, index) => {
        const legendItem = document.createElement("div");
        legendItem.classList.add("legend-item");

        const colorBox = document.createElement("span");
        colorBox.classList.add("legend-color");
        colorBox.style.backgroundColor = backgroundColors[index];

        const textLabel = document.createElement("span");
        textLabel.classList.add("legend-text");
        textLabel.textContent = `${label}: ${dataValues[index]}%`;

        legendItem.appendChild(colorBox);
        legendItem.appendChild(textLabel);
        legendContainer.appendChild(legendItem);
      });
    }

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, []); // ✅ không còn dependency options nữa

  return (
    <div>
      <div className="chart-container">
        <canvas ref={chartRef}></canvas>
      </div>
      <div className="legend-container" id="legend"></div>
    </div>
  );
};

export default NestedDonutChart;
