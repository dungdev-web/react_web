"use client";

import React, { useEffect, useRef, useState } from "react";
import { Chart } from "chart.js";
import { API_URL } from "@/app/(client)/config/config";
import type { ChartData, ChartOptions } from "chart.js";

const RevenueChart = () => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart<"bar"> | null>(null);
  const [chartData, setChartData] = useState<ChartData<"bar"> | null>(null);

  // =======================
  // Fetch data
  // =======================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${API_URL}/api/admin/customers?year=2025`);
        const json = await res.json();

        const monthlyData = json.monthlyData;
        if (!monthlyData) return;

        const months = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];

        const currentCustomersData = months.map(
          (_, index) => monthlyData[index + 1]?.totalCustomers || 0
        );
        const newCustomersData = months.map(
          (_, index) => monthlyData[index + 1]?.newCustomers || 0
        );
        const topCustomerOrdersData = months.map(
          (_, index) => monthlyData[index + 1]?.topCustomerOrders || 0
        );

        const updatedData: ChartData<"bar"> = {
          labels: months,
          datasets: [
            {
              label: "Khách hàng hiện tại",
              backgroundColor: "rgba(209, 110, 229, 1)",
              borderColor: "rgba(209, 110, 229, 1)",
              data: currentCustomersData,
              stack: "stack0",
            },
            {
              label: "Người đăng ký",
              backgroundColor: "rgba(68, 94, 222, 1)",
              borderColor: "rgba(68, 94, 222, 1)",
              data: newCustomersData,
              stack: "stack0",
            },
            {
              label: "Số lượng đơn hàng",
              backgroundColor: "rgba(56, 207, 255, 1)",
              borderColor: "rgba(56, 207, 255, 1)",
              data: topCustomerOrdersData,
              stack: "stack0",
            },
          ],
        };

        setChartData(updatedData);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu khách hàng:", error);
      }
    };

    fetchData();
  }, []);

  // =======================
  // Render chart
  // =======================
  useEffect(() => {
    if (!chartData || !chartRef.current) return;

    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;

    // Khai báo options trong effect để tránh warning exhaustive-deps
    const options: ChartOptions<"bar"> = {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          stacked: true,
          ticks: { color: "#ffffff" },
        },
        x: {
          stacked: true,
          ticks: { color: "#ffffff" },
        },
      },
      plugins: {
        legend: {
          labels: { color: "#ffffff" },
        },
      },
      animation: {
        duration: 300,
      },
    };

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    chartInstance.current = new Chart(ctx, {
      type: "bar",
      data: chartData,
      options,
    });

    // =======================
    // Hover fade effect
    // =======================
    const fadeDataset = (hoverIndex: number) => {
      if (!chartInstance.current) return;

      chartInstance.current.data.datasets.forEach((dataset, index) => {
        if (typeof dataset.backgroundColor === "string") {
          dataset.backgroundColor =
            index === hoverIndex
              ? dataset.backgroundColor.replace(/[\d.]+\)$/g, "1)")
              : dataset.backgroundColor.replace(/[\d.]+\)$/g, "0.2)");
        }
      });

      chartInstance.current.update();
    };

    const resetFade = () => {
      if (!chartInstance.current) return;

      chartInstance.current.data.datasets.forEach((dataset) => {
        if (typeof dataset.backgroundColor === "string") {
          dataset.backgroundColor = dataset.backgroundColor.replace(
            /[\d.]+\)$/g,
            "1)"
          );
        }
      });

      chartInstance.current.update();
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (!chartInstance.current) return;

      const points = chartInstance.current.getElementsAtEventForMode(
        event,
        "nearest",
        { intersect: true },
        true
      );

      if (points.length) {
        fadeDataset(points[0].datasetIndex);
      }
    };

    const handleMouseLeave = () => {
      resetFade();
    };

    const canvas = chartRef.current;
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);

      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [chartData]);

  return (
    <div className="chart-container1">
      <h2>Doanh thu theo loại khách hàng</h2>
      <canvas
        ref={chartRef}
        style={{ width: "100%", height: "350px" }}
      />
    </div>
  );
};

export default RevenueChart;
